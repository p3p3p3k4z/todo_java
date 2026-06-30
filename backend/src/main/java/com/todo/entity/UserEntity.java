package com.todo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa la estructura de un usuario dentro de la base de datos.
 * Cada vez que leemos un registro de la tabla 'users' en Postgres, Spring crea 
 * un objeto de esta clase. Aqui le decimos que el correo no se puede repetir (unique = true) 
 * y que no puede quedar en blanco.
 * 
 * Alguien se registra, tomamos su email y password, creamos un nuevo 'UserEntity', 
 * y al mandarlo a guardar, Hibernate lo convierte en un 'INSERT INTO users...' en la BD.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;
}
