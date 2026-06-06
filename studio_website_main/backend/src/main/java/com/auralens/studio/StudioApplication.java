package com.auralens.studio;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudioApplication {

    public static void main(String[] args) {
        // Load dotenv variables into System Properties before Spring starts
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
            System.out.println("Dotenv variables loaded successfully!");
        } catch (Exception e) {
            System.out.println("No .env file found or failed to load. Using system environment variables: " + e.getMessage());
        }

        SpringApplication.run(StudioApplication.class, args);
    }
}
