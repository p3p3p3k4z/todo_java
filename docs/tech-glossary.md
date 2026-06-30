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

**Docker:** Permite encapsular la base de datos, el backend y el frontend en contenedores aislados que corren identico en la computadora del desarrollador y en el servidor de produccion, resolviendo el problema de "en mi maquina si funciona".

**Flyway:** Es un controlador de versiones para bases de datos. Aplica archivos SQL (`V1__init.sql`, `V2__add_attachments.sql`) secuencialmente. Esto asegura que la base de datos de todos los desarrolladores tenga la estructura exacta y los datos iniciales requeridos.
