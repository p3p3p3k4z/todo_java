package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.entity.TaskEntity;
import com.todo.entity.TaskStatus;
import com.todo.entity.UserEntity;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private UserEntity userEntity;
    private SecurityContext originalSecurityContext;

    @BeforeEach
    void setUp() {
        userEntity = UserEntity.builder()
                .id(1L)
                .email("test@example.com")
                .password("encoded_password")
                .role("ROLE_USER")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");

        originalSecurityContext = SecurityContextHolder.getContext();
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.setContext(originalSecurityContext);
    }

    @Test
    void testCreateTask_Success() {
        TaskRequest request = new TaskRequest("Test Task", "Test Desc", TaskStatus.PENDIENTE, LocalDate.now());
        
        TaskEntity savedTask = TaskEntity.builder()
                .id(1L)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .user(userEntity)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(userEntity));
        when(taskRepository.save(any(TaskEntity.class))).thenReturn(savedTask);

        TaskResponse response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Task", response.getTitle());
    }
}
