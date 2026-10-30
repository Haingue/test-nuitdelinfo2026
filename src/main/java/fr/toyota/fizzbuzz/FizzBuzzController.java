package fr.toyota.fizzbuzz;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/fizzbuzz")
public class FizzBuzzController {

    private final FizzBuzzService service;

    public FizzBuzzController(FizzBuzzService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FizzBuzzResponse> calculate(@Valid @RequestBody FizzBuzzRequest request) {
        FizzBuzzResponse response = service.calculate(request.number());
        return ResponseEntity.created(URI.create("/api/fizzbuzz/" + response.id())).body(response);
    }

    @GetMapping("/{id}")
    public FizzBuzzResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }
}