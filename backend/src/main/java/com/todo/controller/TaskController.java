package com.todo.controller;

import com.todo.dto.AttachmentResponse;
import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Recibe y responde a las peticiones relacionadas con las tareas.
 * Recibe peticiones como "Dame todas las tareas", "Crea una nueva tarea" o 
 * "Borra la tarea 5". Toma esos pedidos, se los pasa al TaskService para que 
 * haga el trabajo, y luego devuelve el resultado final al usuario.
 * 
 * Angular envia un 'DELETE /api/tasks/3'. Este controlador recibe esa señal 
 * especifica en el metodo 'deleteTask', llama a su 'taskService' para destruirla, 
 * y le manda un '204 No Content' (éxito) a Angular.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        return new ResponseEntity<>(taskService.createTask(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para adjuntar archivos a una tarea especifica.
     * Consumo tipo 'multipart/form-data'.
     */
    @PostMapping("/{id}/attachments")
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(taskService.addAttachmentToTask(id, file), HttpStatus.CREATED);
    }
}
