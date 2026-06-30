package com.todo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Define los datos exactos que deben enviarse desde el frontend al registrar a alguien.
 * Le decimos a Spring que forzosamente debe venir un email valido y una contrasena.
 * 
 * Si alguien manda un POST desde postman o Angular, pero le falta la contrasena 
 * o el correo tiene formato incorrecto ("juan.com"), Spring revisa estas validaciones 
 * y rechaza la peticion automaticamente diciendo "Bad Request".
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
