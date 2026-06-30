package com.todo.dto;

import com.todo.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Estructura de datos requerida para crear o actualizar una Tarea.
 * Contiene reglas de validacion para asegurar que el titulo y estado no esten vacios.
 * Adicionalmente, recibe una lista de IDs de usuarios (assigneeIds) para 
 * permitir la asignacion multiple (N personas a 1 tarea).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    private LocalDate dueDate;

    private List<Long> assigneeIds;
}
