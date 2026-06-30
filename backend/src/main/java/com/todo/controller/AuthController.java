package com.todo.controller;

import com.todo.dto.AuthenticationRequest;
import com.todo.dto.AuthenticationResponse;
import com.todo.dto.UserRegistrationRequest;
import com.todo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controla las peticiones de registro e inicio de sesion.
 * Su unica tarea es recibir la informacion que viene del frontend (el correo y la contrasena), 
 * pasarsela al servicio de autenticacion que hace el trabajo pesado, y luego regresar 
 * la respuesta (como un Token) de vuelta a Angular.
 * 
 * Alguien da click en "Ingresar" en Angular. Los datos viajan , llegan 
 * al endpoint '/api/auth/login' de este archivo. Este se los da al AuthService, 
 * obtiene un token largo (eyJhb...), y se lo devuelve al navegador.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
