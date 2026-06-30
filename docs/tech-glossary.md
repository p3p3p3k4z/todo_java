# Glosario Tecnologico y Arquitectonico

Este documento explica las tecnologias utilizadas en el proyecto "To-Do Fullstack", por que se eligieron y como se aplican conceptualmente, sin entrar en detalles de codigo.

## 1. Spring Boot (Framework Backend)

**¿Que es?**  
Spring Boot es un framework basado en Java que simplifica la creacion de aplicaciones empresariales. Provee una configuracion automatica (convencion sobre configuracion) para evitar archivos XML complejos.

**¿Por que se eligio?**  
Es el estandar de la industria para microservicios y aplicaciones monolíticas robustas en Java. Ofrece integracion perfecta con bases de datos y seguridad.

**Conceptos Clave (POO y Arquitectura):**
- **Inversion de Control (IoC):** En lugar de que el desarrollador cree objetos manualmente (usando `new`), el "Contenedor de Spring" es dueño del ciclo de vida de los objetos (llamados Beans) y los entrega a quien los necesite.
- **Inyeccion de Dependencias (DI):** Es la aplicacion practica de la IoC. Si una clase `A` necesita una clase `B`, Spring "inyecta" `B` dentro de `A`. Esto reduce el acoplamiento y facilita el testing.

## 2. Spring Data JPA y Hibernate (ORM)

**¿Que es?**  
JPA (Java Persistence API) es una especificacion para mapear objetos de Java a tablas de bases de datos relacionales. Hibernate es la implementacion mas popular de esta especificacion. Conjuntamente forman un ORM (Object-Relational Mapping).

**¿Por que se eligio?**  
Evita tener que escribir consultas SQL manuales propensas a errores para operaciones CRUD comunes (Crear, Leer, Actualizar, Borrar). Permite trabajar con la base de datos pensando en "Objetos" en lugar de "Tablas".

**Conceptos Clave:**
- **Entidades:** Clases Java que representan tablas. Sus atributos representan las columnas.
- **Repositorios:** Interfaces que heredan comportamiento. Spring genera la logica SQL por detras dinamicamente.
- **Relaciones (Composicion/Agregacion):** Permite vincular objetos, por ejemplo, que una `Tarea` contenga multiples `Archivos Adjuntos` (`@OneToMany`), manejando la complejidad de las Llaves Foraneas internamente.

## 3. Seguridad con JWT (JSON Web Tokens)

**¿Que es?**  
JWT es un estandar para crear tokens de acceso que afirman (claim) la identidad de un usuario. Consta de tres partes cifradas en Base64: Cabecera, Payload (datos) y Firma.

**¿Por que se eligio?**  
A diferencia de las Sesiones tradicionales, JWT no tiene estado (Stateless). El servidor no necesita guardar en memoria quien ha iniciado sesion. Todo lo necesario para validar al usuario viene encriptado en el token, lo cual es ideal para APIs RESTful.

**Como se aplica:**
1. El usuario se loguea (envia email/password).
2. El servidor valida y genera un Token firmado con una llave secreta.
3. El cliente (Angular o Bash CLI) guarda el token y lo envia en la cabecera HTTP (`Authorization: Bearer <token>`) en cada peticion.
4. El Filtro de Spring intercepta la peticion, desencripta el token, verifica que no haya expirado y da acceso al recurso.

## 4. Angular y Standalone Components (Frontend)

**¿Que es?**  
Angular es un framework mantenido por Google para construir aplicaciones web de una sola pagina (SPA). 

**¿Por que se eligio?**  
Es altamente estructurado, basado fuertemente en TypeScript (lo que otorga tipado estatico previniendo errores) e Inyeccion de Dependencias, lo que hace que su filosofia se parezca mucho a la de Spring Boot en Java.

**Conceptos Clave:**
- **Standalone Components:** A partir de Angular 14+, los componentes son independientes. Ya no necesitan estar atados a modulos complejos (`NgModule`), lo que reduce la carga cognitiva, permitiendo que cada componente importe solo lo que usa, mejorando el encapsulamiento.
- **Observables (RxJS):** Angular maneja las respuestas HTTP de forma asincrona usando flujos de datos (streams). Esto permite "reaccionar" cuando llegan los datos del servidor sin bloquear la interfaz de usuario.
- **Interceptors:** Similar a los filtros en backend, interceptan todas las llamadas HTTP salientes para, por ejemplo, inyectar el Token JWT automaticamente.

## 5. Docker y Flyway (Infraestructura)

### Docker
**¿Que es?**  
Es una plataforma que permite empaquetar aplicaciones y sus dependencias en contenedores aislados. Un contenedor es como una maquina virtual superligera que comparte el nucleo del sistema operativo anfitrion.

**¿Por que se eligio?**  
Resuelve el clasico problema de "en mi maquina si funciona". Garantiza que el backend, el frontend y la base de datos se ejecuten exactamente en el mismo entorno, sin importar si el desarrollador usa Linux, Mac o Windows, o si el codigo esta en produccion.

**Como se aplica:**
- El proyecto utiliza `docker-compose.yml` para orquestar tres servicios simultaneamente:
  1. `db`: Una base de datos PostgreSQL.
  2. `api`: El backend Spring Boot empaquetado mediante un `Dockerfile`.
  3. `frontend`: La aplicacion Angular servida a traves de un servidor NGINX.
- Se usan volumenes persistentes (como `api_uploads`) para no perder los archivos adjuntos (imagenes de los gatos) cuando los contenedores se reinician.

### Flyway
**¿Que es?**  
Es un controlador de versiones para bases de datos relacionales. Permite rastrear, administrar y aplicar cambios al esquema de la base de datos mediante scripts SQL puros.

**¿Por que se eligio?**  
A diferencia de permitir que Hibernate genere las tablas automaticamente (lo cual es riesgoso en entornos reales), Flyway da control total y determinista sobre como evoluciona la base de datos con el tiempo, asegurando que todos los desarrolladores tengan la misma estructura.

**Como se aplica:**
- Se ubican los scripts en `backend/src/main/resources/db/migration`.
- El proyecto arranca aplicando secuencias numeradas:
  - `V1__init_schema.sql`: Crea las tablas base de usuarios y tareas.
  - `V2__add_attachments.sql`: Soporte para imagenes.
  - `V4__add_multiple_assignees.sql`: Habilita multiples responsables por tarea.
  - `V5__massive_seed.sql`: Llena la base de datos con mas de 20 tareas preasignadas y usuarios de prueba.
- Spring Boot ejecuta Flyway automaticamente al arrancar, detectando si hay scripts nuevos y aplicandolos antes de exponer la API.
