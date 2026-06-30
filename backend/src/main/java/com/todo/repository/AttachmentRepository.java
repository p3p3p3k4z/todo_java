package com.todo.repository;

import com.todo.entity.AttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Proporciona las operaciones de base de datos para los archivos adjuntos.
 * Se encarga de hacer el trabajo de consultar o guardar informacion en la 
 * 
 * El TaskService llama a 'attachmentRepository.save(nuevoAdjunto)' y este 
 * archivo se encarga de crear el INSERT en la base de datos.
 */
@Repository
public interface AttachmentRepository extends JpaRepository<AttachmentEntity, Long> {
}
