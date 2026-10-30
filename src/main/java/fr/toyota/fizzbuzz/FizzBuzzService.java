package fr.toyota.fizzbuzz;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FizzBuzzService {

    private final FizzBuzzRepository repository;

    public FizzBuzzService(FizzBuzzRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public FizzBuzzResponse calculate(Integer number) {
        String result = evaluate(number);
        FizzBuzzCalculation calculation = repository.save(new FizzBuzzCalculation(number, result));
        return toResponse(calculation);
    }

    @Transactional(readOnly = true)
    public FizzBuzzResponse findById(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Calcul introuvable"));
    }

    private String evaluate(Integer number) {
        if (number % 15 == 0) {
            return "FizzBuzz";
        }
        if (number % 3 == 0) {
            return "Fizz";
        }
        if (number % 5 == 0) {
            return "Buzz";
        }
        return number.toString();
    }

    private FizzBuzzResponse toResponse(FizzBuzzCalculation calculation) {
        return new FizzBuzzResponse(calculation.getId(), calculation.getNumber(), calculation.getResult());
    }
}