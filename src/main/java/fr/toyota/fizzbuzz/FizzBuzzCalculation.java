package fr.toyota.fizzbuzz;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FizzBuzzCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer number;

    private String result;

    protected FizzBuzzCalculation() {
    }

    public FizzBuzzCalculation(Integer number, String result) {
        this.number = number;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public Integer getNumber() {
        return number;
    }

    public String getResult() {
        return result;
    }
}