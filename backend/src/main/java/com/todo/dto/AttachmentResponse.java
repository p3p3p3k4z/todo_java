package com.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Representa la respuesta de un archivo adjunto subido al servidor.
 * Este DTO oculta detalles internos de la base de datos y solo expone al cliente
 * los datos estrictamente necesarios como el nombre del archivo, tipo y ruta.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private String filePath;
    private LocalDateTime uploadedAt;
}
