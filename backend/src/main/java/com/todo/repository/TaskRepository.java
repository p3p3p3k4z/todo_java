package com.todo.repository;

import com.todo.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Gestiona la comunicacion con la base de datos para la tabla de Tareas.
 * Gracias a que extendemos de JpaRepository, Spring nos regala los metodos basicos 
 * como guardar, borrar o buscar, sin que tengamos que escribir codigo SQL manualmente.
 * 
 * Tambien contiene busquedas personalizadas, por ejemplo, encontrar todas las tareas 
 * que le pertenecen a un solo usuario mediante su ID.
 * 
 * Cuando el usuario entra al tablero, el TaskService llama a 'findAllByUserId(5)' 
 * y este archivo va a Postgres y devuelve una lista con todas las tareas del usuario 5.
 */
@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findAllByAssignees_Id(Long userId);
    Optional<TaskEntity> findByIdAndAssignees_Id(Long id, Long userId);
}
