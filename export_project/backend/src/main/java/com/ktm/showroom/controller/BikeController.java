package com.ktm.showroom.controller;

import com.ktm.showroom.model.Bike;
import com.ktm.showroom.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "*")
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping
    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable Long id) {
        Optional<Bike> bike = bikeRepository.findById(id);
        return bike.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bike> addBike(@RequestBody Bike bike) {
        Bike savedBike = bikeRepository.save(bike);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBike);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bike> updateBike(@PathVariable Long id, @RequestBody Bike bikeDetails) {
        Optional<Bike> bikeOpt = bikeRepository.findById(id);
        if (bikeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bike bike = bikeOpt.get();
        bike.setName(bikeDetails.getName());
        bike.setCategory(bikeDetails.getCategory());
        bike.setEngineSize(bikeDetails.getEngineSize());
        bike.setPower(bikeDetails.getPower());
        bike.setPrice(bikeDetails.getPrice());
        bike.setImageUrl(bikeDetails.getImageUrl());
        bike.setDescription(bikeDetails.getDescription());
        bike.setDisplacement(bikeDetails.getDisplacement());
        bike.setTransmission(bikeDetails.getTransmission());
        bike.setCooling(bikeDetails.getCooling());
        bike.setFuelCapacity(bikeDetails.getFuelCapacity());
        bike.setWeight(bikeDetails.getWeight());

        Bike updatedBike = bikeRepository.save(bike);
        return ResponseEntity.ok(updatedBike);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable Long id) {
        if (!bikeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bikeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
