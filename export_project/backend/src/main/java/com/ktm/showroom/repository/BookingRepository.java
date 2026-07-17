package com.ktm.showroom.repository;

import com.ktm.showroom.model.Booking;
import com.ktm.showroom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByUserEmail(String email);
}
