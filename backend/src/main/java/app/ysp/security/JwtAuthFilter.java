package app.ysp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) { this.jwtService = jwtService; }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = null;
        
        // Try to get token from Authorization header first
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }
        
        // For SSE endpoints, also check query parameter since EventSource can't set headers
        if (token == null) {
            token = request.getParameter("token");
        }
        
        if (token != null) {
            try {
                Claims claims = jwtService.parseClaims(token);
                String subject = claims.getSubject();
                String role = claims.get("role", String.class);
                if (subject != null) {
                    // Store the full claims Map as principal so controllers can access all claims including ID
                    java.util.Map<String, Object> principal = new java.util.HashMap<>();
                    principal.put("email", subject);
                    principal.put("id", claims.get("id"));
                    principal.put("role", role);
                    
                    var auth = new UsernamePasswordAuthenticationToken(principal, null,
                            role != null ? Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())) : Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ignored) { }
        }
        filterChain.doFilter(request, response);
    }
}
