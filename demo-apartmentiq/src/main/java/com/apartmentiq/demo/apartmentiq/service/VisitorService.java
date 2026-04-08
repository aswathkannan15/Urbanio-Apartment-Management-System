package com.apartmentiq.demo.apartmentiq.service;

import com.apartmentiq.demo.apartmentiq.dto.PreApproveRequest;
import com.apartmentiq.demo.apartmentiq.dto.VisitorCheckinRequest;
import com.apartmentiq.demo.apartmentiq.dto.VisitorDTO;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.entity.Visitor;
import com.apartmentiq.demo.apartmentiq.repository.NotificationRepository;
import com.apartmentiq.demo.apartmentiq.repository.UserRepository;
import com.apartmentiq.demo.apartmentiq.repository.VisitorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepo;
    private final UserRepository userRepo;
    private final NotificationService notifService;
    private final NotificationRepository notifRepo;

    // Security logs visitor arrival — initiates resident approval flow
    public VisitorDTO checkin(VisitorCheckinRequest req) {
        // Find resident by flat number
        User resident = userRepo.findByFlatNo(req.getFlatToVisit())
            .orElseThrow(() -> new RuntimeException("Resident flat not found"));

        Visitor v = Visitor.builder()
                .visitorName(req.getVisitorName()).phone(req.getPhone())
                .flatToVisit(req.getFlatToVisit()).vehicleNumber(req.getVehicleNumber())
                .photoUrl(req.getPhotoBase64())   
                .status("PENDING")
                .approvedBy(resident)
                .build();
        visitorRepo.save(v);

        // Notify the resident immediately
        notifService.createVisitorRequestNotification(resident, req.getVisitorName(), v.getId());

        return toDTO(v);
    }

    @Transactional
    public VisitorDTO respondToRequest(Long visitorId, String status, Long residentId) {
        Visitor v = visitorRepo.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor record not found"));
        
        if (!v.getApprovedBy().getId().equals(residentId)) {
            throw new RuntimeException("Unauthorised: Not your visitor request");
        }

        v.setStatus(status); // APPROVED or REJECTED
        if ("APPROVED".equalsIgnoreCase(status)) {
            v.setInTime(LocalDateTime.now());
        }
        visitorRepo.save(v);

        // Update actionable notification to reflected completion
        notifRepo.findByTargetIdAndType(visitorId, "VISITOR_REQUEST").ifPresent(n -> {
            n.setActionStatus(status);
            n.setIsRead(true); // Auto-read when actioned
            notifRepo.save(n);
        });

        return toDTO(v);
    }

    public VisitorDTO checkout(Long visitorId) {
        Visitor v = visitorRepo.findById(visitorId).orElseThrow();
        v.setOutTime(LocalDateTime.now());
        v.setStatus("EXITED");
        visitorRepo.save(v);
        return toDTO(v);
    }

    // Resident PRE-APPROVES a guest — arrival at gate doesn't need polling
    public void preApprove(PreApproveRequest req, Long residentId) {
        User resident = userRepo.findById(residentId).orElseThrow();
        Visitor v = Visitor.builder()
                .visitorName(req.getGuestName()).phone(req.getGuestPhone())
                .flatToVisit(resident.getFlatNo())
                .status("APPROVED") // No polling needed, resident already approved
                .approvedBy(resident).build();
        visitorRepo.save(v);
    }

    public List<VisitorDTO> getTodayVisitors() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        return visitorRepo.findAll().stream()
                .filter(v -> v.getInTime() != null && v.getInTime().isAfter(start))
                .sorted((v1, v2) -> v2.getInTime().compareTo(v1.getInTime()))
                .map(this::toDTO).collect(Collectors.toList());
    }

    public VisitorDTO getVisitorById(Long id) {
        return toDTO(visitorRepo.findById(id).orElseThrow());
    }

    private VisitorDTO toDTO(Visitor v) {
        return VisitorDTO.builder().id(v.getId())
                .visitorName(v.getVisitorName()).phone(v.getPhone())
                .flatToVisit(v.getFlatToVisit()).vehicleNumber(v.getVehicleNumber())
                .photoUrl(v.getPhotoUrl())
                .inTime(v.getInTime() != null ? v.getInTime().toString() : null)
                .outTime(v.getOutTime() != null ? v.getOutTime().toString() : null)
                .status(v.getStatus())
                .build();
    }
}
