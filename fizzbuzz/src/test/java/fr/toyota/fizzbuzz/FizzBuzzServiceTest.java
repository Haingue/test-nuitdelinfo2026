package fr.toyota.fizzbuzz;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FizzBuzzServiceTest {

    @Mock
    private FizzBuzzRepository repository;

    @InjectMocks
    private FizzBuzzService service;

    @ParameterizedTest
    @CsvSource({
            "1, 1",
            "3, Fizz",
            "5, Buzz",
            "15, FizzBuzz",
            "30, FizzBuzz",
            "0, FizzBuzz",
            "-3, Fizz",
            "-5, Buzz",
            "-15, FizzBuzz",
            "7, 7",
            "-7, -7"
    })
    void shouldCalculateFizzBuzzAndPersist(Integer number, String expected) {
        when(repository.save(any(FizzBuzzCalculation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FizzBuzzResponse response = service.calculate(number);

        assertThat(response.number()).isEqualTo(number);
        assertThat(response.result()).isEqualTo(expected);
        verify(repository).save(any(FizzBuzzCalculation.class));
    }

    @Test
    void shouldFindCalculationById() {
        FizzBuzzCalculation calculation = new FizzBuzzCalculation(3, "Fizz");
        when(repository.findById(42L)).thenReturn(Optional.of(calculation));

        FizzBuzzResponse response = service.findById(42L);

        assertThat(response.id()).isEqualTo(calculation.getId());
        assertThat(response.number()).isEqualTo(3);
        assertThat(response.result()).isEqualTo("Fizz");
    }

    @Test
    void shouldThrowNotFoundWhenCalculationDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND))
                .hasMessageContaining("Calcul introuvable");
    }
}