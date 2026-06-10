package com.worknest.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {
    @Id
    private String id;
    private String employeeId;
    private int year;
    private LeaveQuota casual;
    private LeaveQuota sick;
    private LeaveQuota earned;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LeaveQuota{
        private int total;
        private int used;
        private int remaining;
    }
}
