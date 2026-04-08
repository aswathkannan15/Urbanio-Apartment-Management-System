package com.apartmentiq.demo.apartmentiq.repository;


import com.apartmentiq.demo.apartmentiq.entity.Booking;
import com.apartmentiq.demo.apartmentiq.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // All bookings for a resident — for "My Bookings" page
    List<Booking> findByResidentIdAndStatusOrderByBookedAtDesc(
            Long residentId, BookingStatus status
    );

    // All bookings for a resident regardless of status
    List<Booking> findByResidentIdOrderByBookedAtDesc(Long residentId);

     @Query("SELECT f.name, COUNT(b) FROM Booking b JOIN b.facility f GROUP BY f.name")
     List<Object[]> countBookingsPerFacility();
}