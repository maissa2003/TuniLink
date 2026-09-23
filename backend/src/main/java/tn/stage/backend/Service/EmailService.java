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

    /**
     * Sent to a newly hired employee (former candidate).
     * Informs them their TuniLink account has been created and they need to activate it.
     */
    public void sendCandidateHiredEmail(String toEmail, String fullName, String temporaryPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("Welcome to TuniLink — Activate Your Account");
            message.setText(
                "Hello " + fullName + ",\n\n" +
                "Congratulations! Your application was successful.\n" +
                "An employee account has been created for you on TuniLink.\n\n" +
                "Login email    : " + toEmail + "\n" +
                "Temp password  : " + temporaryPassword + "\n\n" +
                "Please log in and activate your account:\n" +
                frontendUrl + "/login\n\n" +
                "Best regards,\n" +
                "TuniLink HR Team"
            );
            mailSender.send(message);
            System.out.println("[EMAIL] Candidate hired email sent to: " + toEmail);
        } catch (Exception e) {
            System.out.println("[EMAIL] Failed to send candidate hired email to: " + toEmail);
            e.printStackTrace();
        }
    }

    /**
     * Sent to the client company contact when Finance validates the financial proposal.
     * The client can then log in and approve or reject.
     */
    public void sendClientFinancialProposalEmail(String toEmail, String clientName, String employeeName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("TuniLink — Financial Proposal Ready for Review");
            message.setText(
                "Hello " + clientName + ",\n\n" +
                "A financial proposal for employee " + employeeName + " is ready for your review.\n\n" +
                "Please log in to your TuniLink client portal to review, approve, or request changes:\n" +
                frontendUrl + "/login\n\n" +
                "Best regards,\n" +
                "TuniLink Finance Team"
            );
            mailSender.send(message);
            System.out.println("[EMAIL] Client proposal email sent to: " + toEmail);
        } catch (Exception e) {
            System.out.println("[EMAIL] Failed to send client proposal email to: " + toEmail);
            e.printStackTrace();
        }
    }
}