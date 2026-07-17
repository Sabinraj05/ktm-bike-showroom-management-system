package com.ktm.showroom.repository;

import com.ktm.showroom.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByCategory(String category);
    List<Bike> findByNameContainingIgnoreCase(String name);
}
