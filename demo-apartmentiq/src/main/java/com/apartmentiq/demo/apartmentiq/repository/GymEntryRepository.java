package com.apartmentiq.demo.apartmentiq.repository;

import com.apartmentiq.demo.apartmentiq.entity.GymEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymEntryRepository extends JpaRepository<GymEntry, Long> {

    long countByFacilityIdAndExitTimeIsNull(Long facilityId);

    java.util.Optional<GymEntry> findFirstByFacilityIdAndResidentIdAndExitTimeIsNull(Long facilityId, Long residentId);
}
