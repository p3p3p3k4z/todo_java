package com.todo.service;

import com.todo.dto.AuthenticationRequest;
import com.todo.dto.AuthenticationResponse;
import com.todo.dto.UserRegistrationRequest;
import com.todo.entity.UserEntity;
import com.todo.repository.UserRepository;
import com.todo.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias para la logica de negocio de autenticacion.
 * Se utilizan Mocks (Mockito) para aislar el servicio de la base de datos 
 * y verificar que la generacion de JWT funcione como se espera.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias del Servicio de Autenticacion (AuthService)")
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private UserEntity userEntity;

    @BeforeEach
    void setUp() {
        userEntity = UserEntity.builder()
                .id(1L)
                .email("test@example.com")
                .password("password123")
                .role("DEVELOPER")
                .build();
    }

    @Test
    @DisplayName("Test: Verificacion de Login Exitoso con JWT")
    void testLogin_Success() {
        System.out.println("[TEST] Ejecutando Auth: Verificando que el AuthService genera y retorna un token JWT correctamente al hacer login.");
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password123");
        Authentication authentication = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("mocked-jwt-token");

        AuthenticationResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getToken());
    }

    @Test
    @DisplayName("Test: Verificacion de Registro con Asignacion de Rol")
    void testRegister_Success() {
        System.out.println("[TEST] Ejecutando Auth: Verificando que al registrarse asigne el rol correcto y genere JWT");
        
        UserRegistrationRequest request = new UserRegistrationRequest("newuser@example.com", "password123");
        Authentication authentication = mock(Authentication.class);

        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("password123");
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("new-mocked-jwt-token");

        AuthenticationResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new-mocked-jwt-token", response.getToken());
    }
}
