package com.todo.repository;

import com.todo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Administra el acceso a los datos de los usuarios en la base de datos.
 * Solo le decimos a Spring que queremos buscar un usuario por su email 
 * o checar si existe, y el sistema construye las consultas internamente.
 * 
 * Durante el registro, el AuthService llama a 'findByEmail("juan@mail.com")'. 
 * Si este archivo devuelve algo, significa que el correo ya esta usado y cancela el registro.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
