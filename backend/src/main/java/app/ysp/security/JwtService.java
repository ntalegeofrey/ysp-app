package app.ysp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.jwt.ttlSeconds:7200}")
    private long ttlSeconds;

    private Key key;

    public Key getSigningKey() {
        if (key == null) {
            if (jwtSecret == null || jwtSecret.isBlank()) {
                // generate a random key if not provided (dev default)
                key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            } else {
                key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            }
        }
        return key;
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(ttlSeconds)))
                .signWith(getSigningKey())
                .compact();
    }

    public io.jsonwebtoken.Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
