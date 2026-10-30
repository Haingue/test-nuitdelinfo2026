package fr.toyota.fizzbuzz;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FizzBuzzE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateAndRetrieveCalculationThroughHttp() {
        ResponseEntity<FizzBuzzResponse> created = restTemplate.postForEntity(
                "/api/fizzbuzz", new FizzBuzzRequest(9), FizzBuzzResponse.class);

        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getBody()).isNotNull();
        assertThat(created.getBody().result()).isEqualTo("Fizz");

        ResponseEntity<FizzBuzzResponse> retrieved = restTemplate.getForEntity(
                "/api/fizzbuzz/" + created.getBody().id(), FizzBuzzResponse.class);

        assertThat(retrieved.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(retrieved.getBody()).isEqualTo(created.getBody());
    }
}