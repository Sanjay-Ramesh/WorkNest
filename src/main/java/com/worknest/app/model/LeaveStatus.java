package com.worknest.app.model;

// Lifecycle: PENDING (default on creation) → APPROVED or REJECTED by manager; no further transitions allowed
public enum LeaveStatus {
    PENDING,
    APPROVED,
    REJECTED
}
