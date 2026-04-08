package com.apartmentiq.demo.apartmentiq.exception;


public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg) { super(msg); }
}