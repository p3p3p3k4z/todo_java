# To-Do Fullstack App

Aplicacion de gestion de tareas modular, de alto rendimiento y segura.

## Arquitectura y Stack Tecnologico

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Security (JWT), Spring Data JPA, PostgreSQL.
- **Frontend:** Angular 16 (Standalone Components), Reactive Forms, RxJS.
- **Base de Datos:** PostgreSQL gestionada mediante Flyway para control de versiones (migraciones).
- **Infraestructura:** Docker y docker-compose.

## Requisitos Previos

- Docker y Docker Compose instalados.

## Instrucciones de Ejecucion Local

1. Levanta los contenedores y construye las imagenes (API, Base de Datos, Frontend):
   ```bash
   docker-compose up -d --build
   ```
2. La base de datos (PostgreSQL) estara disponible internamente y en el puerto `5432`. Flyway inicializara el esquema automaticamente.
3. El Backend (API REST) estara expuesto en `http://localhost:8080`.
4. El Frontend (Angular via NGINX) estara expuesto en `http://localhost:80`.

## Endpoints de la API

### Autenticacion
- `POST /api/auth/register`: Crea un nuevo usuario y retorna un JWT.
  - Body: `{ "email": "user@example.com", "password": "password" }`
- `POST /api/auth/login`: Autenticacion de usuario y retorna un JWT.
  - Body: `{ "email": "user@example.com", "password": "password" }`

### Tareas (Protegidos con Header `Authorization: Bearer <token>`)
- `GET /api/tasks`: Obtiene todas las tareas del usuario autenticado.
- `GET /api/tasks/{id}`: Obtiene una tarea especifica.
- `POST /api/tasks`: Crea una nueva tarea.
- `PUT /api/tasks/{id}`: Actualiza una tarea existente.
- `DELETE /api/tasks/{id}`: Elimina una tarea.

## Caracteristicas de Diseño (UI/UX)
- Implementa Standalone Components en Angular para una arquitectura puramente modular.
- Incluye validaciones en frontend y backend (Centralizado con `@ControllerAdvice`).
- Vistas multiples: Lista y Tablero Kanban interactivo.
- Evaluacion de usabilidad (Heuristicas de Nielsen) disponible en la carpeta `docs`.
