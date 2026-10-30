package fr.toyota.fizzbuzz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
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
            "30, FizzBuzz"
    })
    void shouldCalculateFizzBuzzAndPersist(Integer number, String expected) {
        when(repository.save(any(FizzBuzzCalculation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FizzBuzzResponse response = service.calculate(number);

        assertThat(response.number()).isEqualTo(number);
        assertThat(response.result()).isEqualTo(expected);
        verify(repository).save(any(FizzBuzzCalculation.class));
    }
}