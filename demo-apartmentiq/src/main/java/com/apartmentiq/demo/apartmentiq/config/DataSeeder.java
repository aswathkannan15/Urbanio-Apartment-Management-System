package com.apartmentiq.demo.apartmentiq.config;

import com.apartmentiq.demo.apartmentiq.entity.Facility;
import com.apartmentiq.demo.apartmentiq.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// This runs ONCE when Spring Boot starts
// Creates demo facilities so you have data to test with immediately
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final FacilityRepository facilityRepo;

    @Override
    public void run(String... args) {
        // Only seed if table is empty
        if (facilityRepo.count() > 0) return;

        facilityRepo.save(Facility.builder()
                .name("Swimming Pool").type("POOL")
                .capacity(20).openTime("06:00").closeTime("22:00")
                .rules("Shower before entry. No food allowed.").isActive(true).build());

        // ── Update DataSeeder.java ─────────────────────────────
        facilityRepo.save(Facility.builder()
                .name("Gymnasium").type("GYM")
                .capacity(15).openTime("05:00").closeTime("23:00")
                .rules("Bring your own towel. Wipe equipment after use.")
                .requiresBooking(false)   // ← WALK-IN, no slot booking
                .isActive(true).build());

        facilityRepo.save(Facility.builder()
                .name("Party Hall").type("PARTY_HALL")
                .capacity(100).openTime("09:00").closeTime("22:00")
                .rules("Min booking 2 hours. Clean up after event.").isActive(true).build());

        facilityRepo.save(Facility.builder()
                .name("Turf / Sports Court").type("TURF")
                .capacity(22).openTime("06:00").closeTime("21:00")
                .rules("Sports shoes mandatory. Max 22 players.").isActive(true).build());

        facilityRepo.save(Facility.builder()
                .name("Open Theatre").type("THEATRE")
                .capacity(80).openTime("18:00").closeTime("22:00")
                .rules("Events only in evenings. Prior admin approval needed.").isActive(true).build());



        System.out.println("✅ Demo facilities seeded!");
    }
}

