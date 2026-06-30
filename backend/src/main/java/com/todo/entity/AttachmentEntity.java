package com.todo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Modela la informacion de los archivos adjuntos vinculados a una tarea.
 * Guarda el nombre original del archivo, el tipo (ej. PDF o JPG), y en que carpeta de la computadora se guardo.
 * 
 * Cuando alguien quiere ver un adjunto, buscamos este registro para saber 
 * su nombre real ("reporte.pdf") y donde ir a buscarlo fisicamente al disco duro.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task_attachments")
public class AttachmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    /**
     * Relacion con la Tarea:
     * Un adjunto siempre le pertenece a una tarea. Usamos ManyToOne porque
     * muchos adjuntos pueden estar ligados a una sola Tarea.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private TaskEntity task;
}
