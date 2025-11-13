package app.ysp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.from:platform@ysp.app}")
    private String from;

    @Value("${app.brand.logoUrl:}")
    private String brandLogoUrl;

    public MailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendMfaCode(String to, String code) {
        try {
            Context ctx = new Context();
            ctx.setVariable("email", to);
            ctx.setVariable("code", code);
            // Space out the 5 digits for the display line e.g. "8 4 7 2 9"
            String codeSpaced = String.join(" ", code.split(""));
            ctx.setVariable("codeSpaced", codeSpaced);
            boolean cidAttached = false;
            String html = templateEngine.process("mfa-code-inline", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("Your DYS MFA Code");
            // If brandLogoUrl is a data URL, embed it as inline image for reliable email rendering
            if (brandLogoUrl != null && !brandLogoUrl.isBlank() && brandLogoUrl.startsWith("data:")) {
                try {
                    int commaIdx = brandLogoUrl.indexOf(',');
                    String meta = brandLogoUrl.substring(5, commaIdx); // e.g. image/png;base64
                    String mimeType = meta.split(";")[0];
                    String b64 = brandLogoUrl.substring(commaIdx + 1);
                    byte[] bytes = java.util.Base64.getDecoder().decode(b64);
                    helper.addInline("brandLogo", new ByteArrayResource(bytes), mimeType);
                    // Re-render template now that we know CID
                    ctx.setVariable("logoUrl", "cid:brandLogo");
                    html = templateEngine.process("mfa-code-inline", ctx);
                    cidAttached = true;
                } catch (Exception ignore) {
                    // fall back to using provided URL in template
                }
            }
            if (!cidAttached && brandLogoUrl != null && !brandLogoUrl.isBlank()) {
                ctx.setVariable("logoUrl", brandLogoUrl);
                html = templateEngine.process("mfa-code-inline", ctx);
            }
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            // Do not fail auth flow on mail errors during local dev
            System.err.println("[WARN] Failed to send MFA email: " + e.getMessage());
        }
    }
}
