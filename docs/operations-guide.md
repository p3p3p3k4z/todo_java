# Guia de Operaciones e Infraestructura

Este documento describe como gestionar el ciclo de vida de la aplicacion, desde el sembrado de datos (seeding) hasta la administracion de la base de datos y comandos utiles.

## 1. Ejecucion y Sembrado del Proyecto

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
4. **Sembrado Automatico (Seeding):** Al arrancar el backend, Spring Boot detecta las dependencias de **Flyway** y ejecuta todos los scripts SQL de la carpeta `backend/src/main/resources/db/migration/`. 
   - `V1__init_schema.sql` crea la estructura.
   - `V2__add_attachments.sql` añade la tabla de adjuntos.
   - `V3__seed_data.sql` inyecta los usuarios y tareas de prueba. 

Los usuarios por defecto inyectados son:
- `test@admin.com` (Password: `123`)
- `user@test.com` (Password: `123`)
*Nota: La contrasena es intencionalmente simple ('123') ya que la seguridad perimetral la maneja el token JWT y BCrypt en la base de datos.*

## 2. Versionado de Base de Datos (Flyway)

Para mantener la base de datos sincronizada entre todo el equipo de desarrollo o en produccion, se usa Flyway.

### Reglas de Versionado
1. NUNCA modifiques un script SQL existente que ya fue ejecutado (como V1 o V2). Flyway guarda un registro (checksum) en la base de datos y si cambias el archivo, el proyecto no arrancara.
2. Si necesitas hacer un cambio a la base de datos, debes crear un **NUEVO** archivo.

### Como crear un nuevo cambio (Ejemplo)
Si el dia de manana necesitas agregar una tabla de "Comentarios", debes:
1. Ir a la carpeta: `backend/src/main/resources/db/migration/`
2. Crear un archivo llamado: `V4__add_comments_table.sql`
3. Escribir tu codigo SQL dentro (ej. `CREATE TABLE comments (...)`).
4. Al reiniciar la aplicacion con docker-compose, Flyway detectara el archivo V4 y lo ejecutara.

## 3. Comandos Utiles a Futuro

### Ver los logs de la aplicacion (Para debuguear errores del backend)
```bash
docker-compose logs -f api
```

### Detener la aplicacion
```bash
docker-compose down
```

### Resetear la Base de Datos (Borrado Completo)
Si los datos se corrompieron o quieres limpiar todo para que el Seed vuelva a correr desde cero:
```bash
docker-compose down -v
```
*(El flag -v borra los volumenes de Docker, destruyendo los datos de Postgres. Al volver a levantar con 'up', Flyway creara y sembrara todo de nuevo).*

### Ver el estado de los contenedores
```bash
docker-compose ps
```

### 4. Compilar y Ejecutar el Backend localmente (Sin Docker)

Si vienes de compilar archivos Java manualmente usando el comando `java` o `javac`, notarás que Spring Boot es demasiado grande para compilarse archivo por archivo. Para resolver esto, Java utiliza **Maven**.

**¿Qué es Maven?**
Maven es un "gestor de dependencias y construccion". Funciona leyendo el archivo `pom.xml`, donde declaramos qué librerías necesitamos (como Spring Web o PostgreSQL). Maven va a internet, descarga todas esas librerías, compila todo tu código fuente y lo empaqueta en un solo archivo ejecutable llamado `.jar`.

**Pasos para ejecutar el backend manualmente:**

1. Entra a la carpeta del backend:
```bash
cd backend
```

2. Compila el proyecto. No necesitas instalar Maven en tu computadora, el proyecto incluye un "Wrapper" (`mvnw` para Linux/Mac o `mvnw.cmd` para Windows) que descarga Maven automáticamente la primera vez:
```bash
./mvnw clean package -DskipTests
```
*(`clean` borra compilaciones viejas, `package` empaqueta el nuevo codigo, y `-DskipTests` salta las pruebas para que sea mas rapido).*

3. Ejecuta el archivo `.jar` generado en la carpeta `target` usando el comando `java` que ya conoces:
```bash
java -jar target/todo-0.0.1-SNAPSHOT.jar
```

*(O de forma directa y rapida para desarrollo usando Maven: `./mvnw spring-boot:run`)*
