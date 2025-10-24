package com.quicklift.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.quicklift.backend")
public class RideshareBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RideshareBackendApplication.class, args);
	}

}
