package tn.stage.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String username, String temporaryPassword) {

        try {

            System.out.println("========== EMAIL DEBUG ==========");
            System.out.println("From      : " + fromAddress);
            System.out.println("To        : " + toEmail);
            System.out.println("Username  : " + username);

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("Your TuniLink account has been created");

            message.setText(
                    "Hello " + username + ",\n\n" +
                            "An account has been created for you on TuniLink.\n\n" +
                            "Login email: " + toEmail + "\n" +
                            "Temporary password: " + temporaryPassword + "\n\n" +
                            "Please log in and change your password:\n" +
                            frontendUrl + "/login\n\n" +
                            "Best regards,\n" +
                            "TuniLink Team"
            );

            System.out.println("Sending email...");

            mailSender.send(message);

            System.out.println("EMAIL SENT SUCCESSFULLY!");
            System.out.println("===============================");

        } catch (Exception e) {

            System.out.println("EMAIL FAILED!");
            e.printStackTrace();

        }
    }
}