package com.todo.dto;

import com.todo.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Molde utilizado para enviar la informacion de una Tarea hacia el cliente.
 * Evitamos devolver la Entidad de JPA directamente para proteger datos sensibles 
 * y evitar ciclos infinitos de serializacion JSON.
 * Tambien expone arreglos directos (IDs y Emails) de usuarios asignados.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private List<AttachmentResponse> attachments;
    private List<Long> assigneeIds;
    private List<String> assigneeEmails;
}

