package com.resume.analyzer;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AnalyzerApplication {
	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		System.out.println("--- Environment Variables Loaded ---");
		System.out.println("DB_URL: " + System.getProperty("DB_URL"));
		
		SpringApplication.run(AnalyzerApplication.class, args);
	}
}
