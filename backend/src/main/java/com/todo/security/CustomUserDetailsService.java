package com.todo.security;

import com.todo.entity.UserEntity;
import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Actua como puente entre la base de datos y el sistema de seguridad (Spring Security).
 * Toma el correo que el usuario ingreso en el login, busca en nuestra tabla de usuarios, 
 * y si lo encuentra, se lo entrega a Spring Security en el formato que este entiende 
 * para proceder con la verificacion de contraseña y roles.
 * 
 * Cuando un usuario envia su token, el filtro lo intercepta, extrae el email y llama 
 * a esta clase. Esta clase busca en Postgres y responde: "Si, el usuario existe y 
 * es un DEVELOPER", dejando pasar la peticion.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new User(
                userEntity.getEmail(),
                userEntity.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(userEntity.getRole()))
        );
    }
}
