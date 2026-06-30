package com.todo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Objeto de transferencia (DTO) utilizado cuando un usuario intenta iniciar sesion.
 * Define la estructura esperada del cuerpo de la peticion HTTP (email y password) 
 * y aplica validaciones automaticas mediante anotaciones de Spring Boot.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
