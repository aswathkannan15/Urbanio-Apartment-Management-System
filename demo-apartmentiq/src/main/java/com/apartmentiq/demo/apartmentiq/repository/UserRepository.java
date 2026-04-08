package com.apartmentiq.demo.apartmentiq.repository;

import com.apartmentiq.demo.apartmentiq.Role;
import com.apartmentiq.demo.apartmentiq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    List<User> findByRole(Role role);
    Optional<User> findByFlatNo(String flatNo);
}