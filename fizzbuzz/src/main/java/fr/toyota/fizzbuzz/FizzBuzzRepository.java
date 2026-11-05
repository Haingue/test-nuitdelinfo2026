package fr.toyota.fizzbuzz;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FizzBuzzRepository extends JpaRepository<FizzBuzzCalculation, Long> {
}