package com.apartmentiq.demo.apartmentiq.exception;


// Thrown when a slot is already booked
// GlobalExceptionHandler converts this to HTTP 409

public class SlotAlreadyBookedException extends RuntimeException {
    public SlotAlreadyBookedException(String msg) {
        super(msg);
    }
}