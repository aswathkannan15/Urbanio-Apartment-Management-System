package com.apartmentiq.demo.apartmentiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotifDTO {
    private Long    id;
    private String  message;
    private String  type;       // BOOKING, EVENT, VISITOR_REQUEST
    private Long    targetId;
    private String  actionStatus;
    private Boolean isRead;
    private String  createdAt;  // ISO string
}