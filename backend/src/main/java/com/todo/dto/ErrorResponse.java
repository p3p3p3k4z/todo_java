package com.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Formato estandar para todas las respuestas de error de la API.
 * El GlobalExceptionHandler construye y retorna este DTO cuando ocurre 
 * cualquier excepcion, garantizando que el cliente (ej. Angular) 
 * siempre reciba los errores con la misma estructura (status, mensaje, fecha).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String details;
}
