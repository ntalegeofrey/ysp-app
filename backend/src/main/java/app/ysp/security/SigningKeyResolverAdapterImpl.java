package app.ysp.security;

import io.jsonwebtoken.SigningKeyResolverAdapter;
 

import java.security.Key;

public class SigningKeyResolverAdapterImpl extends SigningKeyResolverAdapter {
    private final JwtService jwtService;
    public SigningKeyResolverAdapterImpl(JwtService jwtService) { this.jwtService = jwtService; }
    @Override
    @SuppressWarnings("rawtypes")
    public Key resolveSigningKey(io.jsonwebtoken.JwsHeader header, String plaintext) {
        // We reuse JwtService's generated/provided key
        return jwtService.getSigningKey();
    }
}
