package com.worknest.app.service;

import com.worknest.app.model.LeaveStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String mailFrom;

    // Sends a plain-text notification email to the employee with their leave outcome.
    // Called by LeaveService.updateLeaveStatus after a manager approves or rejects a request.
    @Async
    public void sendLeaveStatusEmail(String toEmail,
                                     String employeeName,
                                     LeaveStatus status){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(mailFrom);
        message.setTo(toEmail);
        message.setSubject("Your Leave Request has been " + status);
        message.setText("Dear " + employeeName + ", your leave has been " + status);

        javaMailSender.send(message);
    }
}