package com.worknest.app.model;

// MANAGER can approve/reject leave; HR_ADMIN has org-wide visibility; SUPER_ADMIN has full system access
public enum Role {
    EMPLOYEE,
    MANAGER,
    HR_ADMIN,
    SUPER_ADMIN
}
