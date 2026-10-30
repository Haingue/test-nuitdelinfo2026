package fr.toyota.fizzbuzz;

import jakarta.validation.constraints.NotNull;

public record FizzBuzzRequest(@NotNull Integer number) {
}