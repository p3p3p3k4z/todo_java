# Guia de Arquitectura y Operaciones del Backend (Java / Spring Boot)

Este documento describe la arquitectura interna del backend, los módulos que lo componen, el flujo de operaciones, y cómo gestionar el ciclo de vida de la aplicación incluyendo bases de datos y despliegue.

---

## 1. Arquitectura del Backend y Árbol de Archivos

El proyecto sigue una arquitectura estricta de **Capas (N-Tier Architecture)** apoyada por el framework Spring Boot. Esto asegura que la lógica de negocio esté separada de la base de datos y de las peticiones HTTP.

```text
backend/src/main/java/com/todo/
├── config/                 # Configuraciones globales (WebMvcConfigurer, CORS, Rutas de Uploads)
├── controller/             # [CAPA HTTP] Controladores RESTful (TaskController, AuthController)
├── dto/                    # [CAPA DTO] Data Transfer Objects (Payloads y validaciones de entrada/salida)
├── entity/                 # [CAPA JPA] Entidades Mapeadas a la Base de Datos (User, Task, TaskAttachment)
├── exception/              # [CAPA ERRORES] Manejadores globales de errores (@ControllerAdvice)
├── repository/             # [CAPA DAO/DATOS] Interfaces Spring Data JPA (TaskRepository, UserRepository)
├── security/               # [CAPA SEGURIDAD] Filtros JWT, configuracion de Spring Security y cifrado
├── service/                # [CAPA NEGOCIO] Logica pesada de la aplicacion (TaskService, FileStorageService)
└── TodoApplication.java    # Clase principal que arranca el servidor embebido (Tomcat)
```

### 1.1 Módulos y Flujo de Operaciones (El ciclo de vida de una petición)
Cuando el frontend pide o envía datos, el flujo atraviesa los siguientes módulos en este orden estricto:

1. **`security/` (Filtros JWT)**: Antes de tocar tu código, Spring Security y el `JwtAuthenticationFilter` revisan si la petición trae un Token válido. Si no lo trae, se rechaza con un error `401 Unauthorized`.
2. **`controller/` (Controladores)**: Son los recepcionistas. Reciben el JSON del frontend, deciden qué hacer y a quién llamar. *Ejemplo: `TaskController` atiende las peticiones a `/api/tasks`.*
3. **`dto/` (Data Transfer Objects)**: Los controladores nunca reciben "Entidades" puras, reciben DTOs (ej. `TaskDto`). Estos objetos sirven como un filtro de validación (revisan que el título no venga vacío, que los emails tengan formato correcto, etc).
4. **`service/` (Servicios)**: Aquí vive la verdadera lógica de negocio. El `TaskService` procesa el DTO, verifica permisos, maneja archivos con `FileStorageService`, y orquesta qué datos deben guardarse.
5. **`repository/` (DAOs - Data Access Objects)**: Es la interfaz que se conecta a PostgreSQL. Extiende de `JpaRepository` para darnos acceso inmediato a operaciones como `save()`, `findById()`, sin escribir SQL manual.
6. **`entity/` (Entidades)**: Son las clases Java que usan anotaciones de Hibernate (ej. `@Entity`, `@Table`) para representar exactamente cómo se ve una tabla en la base de datos.

---

## 2. Tecnología de Migración de Base de Datos (Flyway)

En lugar de crear las tablas manualmente entrando a PostgreSQL, este proyecto usa **Flyway**.

### ¿Qué es Flyway?
Flyway es un sistema de control de versiones para tu base de datos (piénsalo como un "Git" para bases de datos). Te permite escribir archivos SQL que Flyway ejecutará de forma automática y ordenada cada vez que enciendas la aplicación.

### ¿Por qué se usa?
Si trabajas en equipo o despliegas a producción, asegurar que todas las bases de datos tengan las mismas columnas y tablas es un dolor de cabeza. Con Flyway, el código SQL viaja junto con el código Java, garantizando que si la App enciende, la base de datos es 100% compatible.

### Reglas de Versionado (¡Muy Importante!)
Todos los scripts viven en la carpeta `backend/src/main/resources/db/migration/`.

1. **Nomenclatura estricta**: Los archivos deben llamarse `V1__nombre.sql`, `V2__nombre.sql`, `V3__nombre.sql`, con **doble guion bajo (`__`)**.
2. **Inmutabilidad**: NUNCA modifiques un script SQL que ya fue ejecutado (como V1 o V2). Flyway guarda un registro hash (checksum) en una tabla oculta en PostgreSQL llamada `flyway_schema_history`. Si cambias una sola letra de un archivo viejo, Flyway detectará que fue alterado y bloqueará el arranque del proyecto.
3. **Evolución progresiva**: Si necesitas modificar una tabla existente, no edites el `V1__init_schema.sql`. En su lugar, crea un `V6__alter_table.sql` con un comando `ALTER TABLE ...`.

*(Actualmente el proyecto cuenta con scripts desde el V1 hasta el V5, el cual contiene el sembrado masivo de tareas).*

---

## 3. Ejecución y Sembrado del Proyecto

El proyecto utiliza Docker Compose para levantar todos los servicios (Base de datos, Backend, Frontend) de forma sincronizada.

### Comando Principal
Para construir y levantar el proyecto completo:
```bash
docker-compose up -d --build
```
Este comando hace lo siguiente:
1. Construye la imagen del Backend (compilando el jar con Maven).
2. Construye la imagen del Frontend (compilando Angular).
3. Inicia la base de datos PostgreSQL.
4. **Sembrado Automático (Seeding):** Al arrancar el backend, Flyway detecta los scripts y los ejecuta secuencialmente inyectando las tablas y las tareas de prueba.

---

## 4. Comandos Útiles a Futuro

### Ver los logs de la aplicación (Para debuguear errores del backend)
```bash
docker-compose logs -f api
```

### Resetear la Base de Datos Completamente
Si necesitas limpiar la base de datos para que Flyway corra los scripts desde cero sin perder tus imágenes adjuntas en el disco (el volumen `api_uploads`):
```bash
docker exec todo_db psql -U root -d tododb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker restart todo_api
```
*(Si usas `docker-compose down -v` se borrarán tanto los datos SQL como las imágenes físicas que los usuarios hayan subido).*

---

## 5. Pruebas y Aseguramiento de Calidad (Testing)

Para ejecutar las pruebas unitarias usando JUnit y Mockito, puedes usar un contenedor volátil montando tu código fuente. Ejecuta esto desde la raíz del proyecto:
```bash
docker run --rm -v $(pwd)/backend:/app:z -w /app maven:3.9-eclipse-temurin-17-alpine mvn test
```

---

## 6. Pruebas de API por Terminal (CLI Verifier)

El proyecto incluye un script interactivo en bash llamado `cli-verifier.sh` ubicado en la raíz. 
Este script te permite probar manualmente los endpoints de la API (Login, ver tareas, crear tareas, subir adjuntos) directamente desde tu terminal usando `curl` y formateando las respuestas con `jq`, sin necesidad de abrir Postman o el Frontend.

Para ejecutarlo:
```bash
./cli-verifier.sh
```
