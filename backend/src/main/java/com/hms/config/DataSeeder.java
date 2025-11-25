package com.hms.config;

import com.hms.model.Role;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

@Configuration
public class DataSeeder {
  @Bean
  public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder encoder) {
    return args -> {
      if (userRepository.findByEmail("admin@hms.com").isEmpty()) {
        User u = new User();
        u.setName("Admin");
        u.setEmail("admin@hms.com");
        u.setPasswordHash(encoder.encode("Admin@123"));
        u.setRole(Role.ADMIN);
        u.setCreatedAt(Instant.now());
        u.setUpdatedAt(Instant.now());
        userRepository.save(u);
      }
    };
  }
}
