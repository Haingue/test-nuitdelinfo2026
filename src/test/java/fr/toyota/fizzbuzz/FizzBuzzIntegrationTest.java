package fr.toyota.fizzbuzz;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class FizzBuzzIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FizzBuzzRepository repository;

    @Test
    void shouldCalculateAndPersistFizzBuzz() throws Exception {
        mockMvc.perform(post("/api/fizzbuzz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"number\":15}"))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.number").value(15))
                .andExpect(jsonPath("$.result").value("FizzBuzz"))
                .andExpect(jsonPath("$.id").isNumber());

        assertThat(repository.findAll())
                .anySatisfy(calculation -> {
                    assertThat(calculation.getNumber()).isEqualTo(15);
                    assertThat(calculation.getResult()).isEqualTo("FizzBuzz");
                });
    }

    @Test
    void shouldRejectMissingNumber() throws Exception {
        mockMvc.perform(post("/api/fizzbuzz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}