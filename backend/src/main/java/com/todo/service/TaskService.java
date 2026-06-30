package com.todo.service;

import com.todo.dto.AttachmentResponse;
import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.entity.AttachmentEntity;
import com.todo.entity.TaskEntity;
import com.todo.entity.UserEntity;
import com.todo.exception.ResourceNotFoundException;
import com.todo.repository.AttachmentRepository;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Contiene toda la logica de negocio relacionada con las tareas.
 * El controlador recibe las peticiones de Angular y se las pasa a este archivo. 
 * Aqui nos aseguramos de saber quien es el usuario que esta haciendo la peticion, 
 * buscamos sus tareas en la base de datos, y convertimos los resultados en un 
 * formato limpio antes de regresarlos al cliente.
 * 
 * Al pedir crear una tarea, este archivo saca tu ID del token, arma la 
 * nueva Tarea vinculada a ti, la guarda usando el TaskRepository, y te devuelve 
 * un resumen de lo guardado.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService;

    /**
     * Metodo privado (Encapsulamiento de comportamiento):
     * Solo la logica interna de TaskService necesita saber como extraer el 
     * usuario del contexto de seguridad. No se expone hacia afuera.
     */
    private UserEntity getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<TaskResponse> getAllTasks() {
        UserEntity user = getAuthenticatedUser();
        // Programacion Funcional (Streams) combinada con POO (metodos de instancia)
        return taskRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        UserEntity user = getAuthenticatedUser();
        TaskEntity task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        UserEntity user = getAuthenticatedUser();

        // Patron de Diseno Builder: Construccion paso a paso del objeto.
        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        TaskEntity savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        UserEntity user = getAuthenticatedUser();
        TaskEntity task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // Modificando estado interno mediante Setters
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        TaskEntity updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        UserEntity user = getAuthenticatedUser();
        TaskEntity task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        taskRepository.delete(task);
    }

    /**
     * Carga un archivo, lo guarda en local, y registra la entidad en la DB.
     */
    @Transactional
    public AttachmentResponse addAttachmentToTask(Long taskId, MultipartFile file) {
        UserEntity user = getAuthenticatedUser();
        TaskEntity task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // 1. Guardar archivo en File System
        String filePath = fileStorageService.storeFile(file);

        // 2. Instanciar y relacionar la nueva Entidad
        AttachmentEntity attachment = AttachmentEntity.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath)
                .task(task)
                .uploadedAt(LocalDateTime.now())
                .build();

        task.getAttachments().add(attachment);
        AttachmentEntity savedAttachment = attachmentRepository.save(attachment);

        return mapAttachmentToResponse(savedAttachment);
    }

    /**
     * Mapeo Entidad -> DTO:
     * Trasladamos datos desde un modelo de DB (TaskEntity) a un modelo de 
     * presentacion (TaskResponse).
     */
    private TaskResponse mapToResponse(TaskEntity task) {
        List<AttachmentResponse> attachmentResponses = task.getAttachments() != null 
                ? task.getAttachments().stream().map(this::mapAttachmentToResponse).collect(Collectors.toList()) 
                : null;

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .attachments(attachmentResponses)
                .build();
    }

    private AttachmentResponse mapAttachmentToResponse(AttachmentEntity attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .filePath(attachment.getFilePath())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
}
