package com.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Objeto de transferencia (DTO) devuelto al cliente despues de un login o registro exitoso.
 * Encapsula el token JWT (Bearer token) que el cliente (ej. Angular) debera almacenar 
 * y enviar en las siguientes peticiones para autenticarse.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
}
