package com.todo.service;

import com.todo.dto.AuthenticationRequest;
import com.todo.dto.AuthenticationResponse;
import com.todo.dto.UserRegistrationRequest;
import com.todo.entity.UserEntity;
import com.todo.repository.UserRepository;
import com.todo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Maneja el proceso de registro y autenticacion de usuarios.
 * Cuando alguien se registra, revisa que el correo no este usado y lo guarda 
 * en la base de datos. Cuando alguien hace login, compara el usuario y contrasena 
 * con la base de datos y le genera un token para que pueda navegar por la app.
 * 
 * Si alguien inicia sesion, este archivo va a pedirle a Spring Security que revise 
 * la clave. Si la clave esta bien, le pide al JwtTokenProvider un nuevo token 
 * y se lo entrega de regreso a Angular.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public void register(UserRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken!");
        }

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                // Encriptamos la contrasena antes de guardarla

                .password(passwordEncoder.encode(request.getPassword()))
                .role("DEVELOPER")
                .build();

        userRepository.save(user);
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        // Se orquesta el inicio de sesion validando el usuario contra el contexto de Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);

        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }
}
