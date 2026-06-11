package com.worknest.app.service;

import com.worknest.app.model.LeaveStatus;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    // Sends a plain-text notification email to the employee with their leave outcome.
    // Called by LeaveService.updateLeaveStatus after a manager approves or rejects a request.
    public void sendLeaveStatusEmail(String toEmail,
                                     String employeeName,
                                     LeaveStatus status){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("sanjayramesh1425@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Your Leave Request has been " + status);
        message.setText("Dear " + employeeName + ", your leave has been " + status);

        javaMailSender.send(message);
    }
}