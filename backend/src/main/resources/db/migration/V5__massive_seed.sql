INSERT INTO tasks (title, description, status, due_date) VALUES 
-- PM
('Kickoff de Proyecto', 'Reunion inicial con stakeholders para definir el MVP.', 'COMPLETADA', '2026-05-01'),
('Definicion de Requerimientos', 'Escribir documento PRD para la aplicacion To-Do.', 'COMPLETADA', '2026-05-05'),
('Asignacion de Recursos', 'Distribuir horas estimadas por equipo (Backend, Frontend).', 'COMPLETADA', '2026-05-10'),
('Planificacion de Sprints', 'Organizar el backlog de Jira para los proximos 4 sprints.', 'EN_PROGRESO', '2026-06-15'),
('Reunion de Estatus', 'Daily standup con los tech leads.', 'EN_PROGRESO', '2026-06-16'),
('Revision de Presupuesto', 'Validar los costos de AWS para el despliegue de produccion.', 'PENDIENTE', '2026-07-01'),
('Aprobacion de Diseno UI', 'Firmar los wireframes y paleta institucional entregados por el equipo UX.', 'COMPLETADA', '2026-05-12'),
('Preparacion de Demo', 'Preparar el entorno de Staging para la demostracion al cliente.', 'PENDIENTE', '2026-07-10'),
('Analisis de Riesgos', 'Identificar cuellos de botella en la entrega de la API.', 'PENDIENTE', '2026-07-15'),
('Retrospectiva Sprint 1', 'Evaluar que salio bien y mal durante el primer ciclo de desarrollo.', 'COMPLETADA', '2026-06-01'),

-- Senior
('Definicion de Arquitectura', 'Definir el patron MVC y la estructura de carpetas en Angular.', 'COMPLETADA', '2026-05-08'),
('Revision de PRs', 'Code review exhaustivo de los controladores de Spring Boot.', 'EN_PROGRESO', '2026-06-20'),
('Optimizacion de Consultas', 'Mejorar el N+1 problem en las consultas de Hibernate con EntityGraphs.', 'EN_PROGRESO', '2026-06-22'),
('Mentoría a Juniors', 'Pair programming con el JR para entender RxJS.', 'COMPLETADA', '2026-06-10'),
('Configuracion de Seguridad', 'Implementar filtros globales y CSRF en Spring Security.', 'COMPLETADA', '2026-05-25'),
('Refactorizacion de Servicios', 'Mover la logica de negocio fuera de los Controllers hacia los Services.', 'PENDIENTE', '2026-07-05'),
('Auditoria de Codigo Frontend', 'Revisar la eliminacion de box-shadow y aplicacion estricta de Flat Design.', 'COMPLETADA', '2026-06-12'),
('Creacion de Documentacion', 'Escribir el frontend-architecture.md.', 'COMPLETADA', '2026-06-14'),
('Integracion Continua', 'Revisar los pipelines junto con el DevOps.', 'PENDIENTE', '2026-07-02'),
('Resolucion de Bugs Criticos', 'Fixear memory leak reportado en el Kanban Board.', 'PENDIENTE', '2026-07-18'),

-- Junior
('Crear Entidad User', 'Implementar la clase User en Java con anotaciones JPA.', 'COMPLETADA', '2026-05-15'),
('Maquetacion de Login', 'Hacer el HTML y CSS basico para la pantalla de inicio de sesion.', 'COMPLETADA', '2026-05-20'),
('Añadir Rutas Angular', 'Configurar el archivo app.routes.ts con los paths principales.', 'COMPLETADA', '2026-05-25'),
('Corregir Typos', 'Fixear errores ortograficos en los alerts de la aplicacion.', 'COMPLETADA', '2026-06-01'),
('Ajuste de Botones', 'Asegurar que todos los botones tengan el color Guinda (#8C1D40).', 'EN_PROGRESO', '2026-06-25'),
('Implementar Iconos', 'Poner Lucide Icons en el sidebar (CheckSquare, List, Layout...).', 'COMPLETADA', '2026-06-05'),
('Pruebas Manuales', 'Crear tareas de prueba desde la interfaz para verificar conexion.', 'EN_PROGRESO', '2026-06-28'),
('Documentar Endpoints', 'Usar Swagger UI para probar los servicios.', 'PENDIENTE', '2026-07-05'),
('Cambiar Fuentes', 'Asegurar que la tipografia principal aplique en toda la web.', 'PENDIENTE', '2026-07-10'),
('Componente Spinner', 'Crear un circulo de carga para cuando la API se tarde.', 'COMPLETADA', '2026-05-30'),

-- Backend
('Setup Spring Boot', 'Inicializar proyecto con Spring Web, JPA y PostgreSQL driver.', 'COMPLETADA', '2026-05-10'),
('Controlador de Tareas', 'Metodos GET, POST, PUT, DELETE para TaskController.', 'COMPLETADA', '2026-05-15'),
('Filtro JWT', 'Crear JwtAuthenticationFilter para interceptar cabeceras Bearer.', 'COMPLETADA', '2026-05-20'),
('Servicio de Almacenamiento', 'Manejar MultipartFile para subir adjuntos a /uploads.', 'EN_PROGRESO', '2026-06-18'),
('Manejo de Excepciones', 'Crear @RestControllerAdvice para atrapar EntityNotFoundException.', 'COMPLETADA', '2026-06-01'),
('Validaciones DTO', 'Añadir @NotNull y @Size en los objetos de transferencia de datos.', 'EN_PROGRESO', '2026-06-20'),
('Paginacion de Tareas', 'Implementar Pageable en los repositorios de Spring Data.', 'PENDIENTE', '2026-07-02'),
('Soft Delete', 'Añadir columna is_deleted para no borrar los registros fisicamente.', 'PENDIENTE', '2026-07-08'),
('Generacion de Reportes', 'Endpoint para descargar un Excel con las tareas completadas.', 'PENDIENTE', '2026-07-15'),
('Test Unitarios Auth', 'Testear que los tokens invalidos retornen 401 Unauthorized.', 'PENDIENTE', '2026-07-20'),

-- Frontend
('Setup Angular 18', 'Crear el workspace con standalone components habilitados por defecto.', 'COMPLETADA', '2026-05-10'),
('Servicio Task API', 'Consumir los endpoints CRUD con HttpClient.', 'COMPLETADA', '2026-05-15'),
('Interceptor Auth', 'Atrapar requests y ponerle el Authorization: Bearer token.', 'COMPLETADA', '2026-05-20'),
('Orquestador TaskBoard', 'Implementar ngSwitch para rotar entre lista, kanban y muro.', 'COMPLETADA', '2026-05-25'),
('Vista Kanban Dinamica', 'Hacer columnas de PENDIENTE, EN_PROGRESO, COMPLETADA iterables.', 'EN_PROGRESO', '2026-06-18'),
('Muro Sticky Luma', 'Calcular luminosidad del color random para el texto de Post-Its.', 'COMPLETADA', '2026-06-05'),
('Vista Calendario CSS Grid', 'Renderizar dias del mes usando math en TypeScript y grid en CSS.', 'EN_PROGRESO', '2026-06-25'),
('Upload de Archivos Form', 'Limpiar el input type="file" al cancelar el modal.', 'COMPLETADA', '2026-06-12'),
('Responsive Design', 'Ajustar breakpoints para que el kanban no se rompa en mobile.', 'PENDIENTE', '2026-07-05'),
('Optimizacion de Assets', 'Comprimir las imagenes de gatos de prueba.', 'PENDIENTE', '2026-07-10'),

-- DevOps
('Crear Dockerfile Backend', 'Multi-stage build usando maven y eclipse-temurin.', 'COMPLETADA', '2026-05-20'),
('Crear Dockerfile Frontend', 'Configuracion para levantar Angular con nginx.', 'COMPLETADA', '2026-05-22'),
('docker-compose.yml', 'Orquestar db, api y frontend en la misma red (todo_network).', 'COMPLETADA', '2026-05-25'),
('Volumenes Persistentes', 'Asegurar que pgdata y api_uploads no se borren tras reinicios.', 'COMPLETADA', '2026-06-01'),
('CI/CD GitHub Actions', 'Pipeline basico para compilar al hacer push a main.', 'EN_PROGRESO', '2026-06-20'),
('Monitoreo con Prometheus', 'Exportar metricas de Spring Boot Actuator.', 'PENDIENTE', '2026-07-15'),
('Balanceador de Carga', 'Configurar HAProxy delante de las instancias del frontend.', 'PENDIENTE', '2026-07-20'),
('Respaldos Automatizados', 'Script bash para hacer pg_dump cada madrugada.', 'PENDIENTE', '2026-07-25'),
('Certificados SSL', 'Implementar Let''s Encrypt para HTTPS.', 'PENDIENTE', '2026-07-30'),
('Alerta de Caidas', 'Notificacion por Slack si algun contenedor muere inesperadamente.', 'PENDIENTE', '2026-08-05'),

-- Machine Learning / AI
('Analisis Sentimientos', 'Crear modelo para detectar el tono de la descripcion de las tareas.', 'EN_PROGRESO', '2026-06-28'),
('Clasificacion Automatica', 'Etiquetar tareas automaticamente basado en palabras clave (Frontend/Backend).', 'PENDIENTE', '2026-07-10'),
('Prediccion de Tiempos', 'Estimar cuantos dias tomara una tarea usando historicos.', 'PENDIENTE', '2026-07-25'),
('Chatbot Asistente', 'Integrar API de LLM para responder dudas sobre las tareas.', 'PENDIENTE', '2026-08-15'),
('Traduccion al Vuelo', 'Traducir descripciones del espanol al ingles de forma automatica.', 'PENDIENTE', '2026-08-01'),
('Resumen de Reunion', 'Transcribir audios de las dailys y convertirlos en tareas en el Kanban.', 'PENDIENTE', '2026-09-01'),
('Deteccion de Anomalias', 'Avisar si una tarea lleva "EN_PROGRESO" demasiado tiempo.', 'EN_PROGRESO', '2026-06-30'),
('Generacion de Portadas', 'Crear imagenes AI automaticas para tareas sin adjunto.', 'PENDIENTE', '2026-08-10'),
('Priorizacion Dinamica', 'Ordenar backlog sugiriendo que tarea es mas urgente.', 'PENDIENTE', '2026-07-20'),
('Agrupacion K-Means', 'Agrupar usuarios con comportamientos similares de resolucion de tareas.', 'PENDIENTE', '2026-09-15'),

-- Data Analyst
('ETL de Tareas', 'Extraer datos de Postgres, transformar y cargar en Data Warehouse.', 'EN_PROGRESO', '2026-06-25'),
('Dashboard Directivo', 'Crear tablero en Tableau con las KPIs de eficiencia del equipo.', 'EN_PROGRESO', '2026-06-28'),
('Reporte de Productividad', 'Analizar que dia de la semana se completan mas tareas.', 'PENDIENTE', '2026-07-05'),
('Analisis de Cuellos de Botella', 'Identificar en que fase (Pendiente->Progreso) tardan mas las tareas.', 'COMPLETADA', '2026-06-15'),
('Limpieza de Datos', 'Detectar y eliminar tareas duplicadas generadas en pruebas.', 'COMPLETADA', '2026-06-18'),
('Migraciones V1 a V3', 'Validar que el schema y los datos esten integros tras los scripts Flyway.', 'COMPLETADA', '2026-06-05'),
('Prediccion de Carga', 'Proyectar cantidad de tareas para el siguiente cuatrimestre.', 'PENDIENTE', '2026-07-20'),
('Auditoria de Asignaciones', 'Verificar si hay usuarios con sobrecarga de trabajo.', 'PENDIENTE', '2026-07-12'),
('Script Sembrado Masivo', 'Generar V5__massive_seed.sql con mas de 80 registros.', 'COMPLETADA', '2026-06-30'),
('Mapeo de Adjuntos', 'Cuantificar cuantas tareas tienen imagenes vs texto plano.', 'PENDIENTE', '2026-07-15');

-- Asignacion de tareas
DO $$
DECLARE
    t_id BIGINT;
    u_pm BIGINT;
    u_sr BIGINT;
    u_jr BIGINT;
    u_bk BIGINT;
    u_fr BIGINT;
    u_do BIGINT;
    u_ml BIGINT;
    u_da BIGINT;
BEGIN
    SELECT id INTO u_pm FROM users WHERE email='pm@devteam.com';
    SELECT id INTO u_sr FROM users WHERE email='senior@devteam.com';
    SELECT id INTO u_jr FROM users WHERE email='junior@devteam.com';
    SELECT id INTO u_bk FROM users WHERE email='backend@devteam.com';
    SELECT id INTO u_fr FROM users WHERE email='frontend@devteam.com';
    SELECT id INTO u_do FROM users WHERE email='devops@devteam.com';
    SELECT id INTO u_ml FROM users WHERE email='machinelearning@devteam.com';
    SELECT id INTO u_da FROM users WHERE email='data@devteam.com';

    -- PM
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Kickoff de Proyecto', 'Definicion de Requerimientos', 'Asignacion de Recursos', 'Planificacion de Sprints', 'Reunion de Estatus', 'Revision de Presupuesto', 'Aprobacion de Diseno UI', 'Preparacion de Demo', 'Analisis de Riesgos', 'Retrospectiva Sprint 1')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_pm);
    END LOOP;

    -- SR
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Definicion de Arquitectura', 'Revision de PRs', 'Optimizacion de Consultas', 'Mentoría a Juniors', 'Configuracion de Seguridad', 'Refactorizacion de Servicios', 'Auditoria de Codigo Frontend', 'Creacion de Documentacion', 'Integracion Continua', 'Resolucion de Bugs Criticos')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_sr);
    END LOOP;

    -- JR
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Crear Entidad User', 'Maquetacion de Login', 'Añadir Rutas Angular', 'Corregir Typos', 'Ajuste de Botones', 'Implementar Iconos', 'Pruebas Manuales', 'Documentar Endpoints', 'Cambiar Fuentes', 'Componente Spinner')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_jr);
    END LOOP;

    -- BK
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Setup Spring Boot', 'Controlador de Tareas', 'Filtro JWT', 'Servicio de Almacenamiento', 'Manejo de Excepciones', 'Validaciones DTO', 'Paginacion de Tareas', 'Soft Delete', 'Generacion de Reportes', 'Test Unitarios Auth')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_bk);
    END LOOP;

    -- FR
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Setup Angular 18', 'Servicio Task API', 'Interceptor Auth', 'Orquestador TaskBoard', 'Vista Kanban Dinamica', 'Muro Sticky Luma', 'Vista Calendario CSS Grid', 'Upload de Archivos Form', 'Responsive Design', 'Optimizacion de Assets')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_fr);
    END LOOP;

    -- DO
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Crear Dockerfile Backend', 'Crear Dockerfile Frontend', 'docker-compose.yml', 'Volumenes Persistentes', 'CI/CD GitHub Actions', 'Monitoreo con Prometheus', 'Balanceador de Carga', 'Respaldos Automatizados', 'Certificados SSL', 'Alerta de Caidas')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_do);
    END LOOP;

    -- ML
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('Analisis Sentimientos', 'Clasificacion Automatica', 'Prediccion de Tiempos', 'Chatbot Asistente', 'Traduccion al Vuelo', 'Resumen de Reunion', 'Deteccion de Anomalias', 'Generacion de Portadas', 'Priorizacion Dinamica', 'Agrupacion K-Means')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_ml);
    END LOOP;

    -- DA
    FOR t_id IN (SELECT id FROM tasks WHERE title IN ('ETL de Tareas', 'Dashboard Directivo', 'Reporte de Productividad', 'Analisis de Cuellos de Botella', 'Limpieza de Datos', 'Migraciones V1 a V3', 'Prediccion de Carga', 'Auditoria de Asignaciones', 'Script Sembrado Masivo', 'Mapeo de Adjuntos')) LOOP
        INSERT INTO task_assignees(task_id, user_id) VALUES (t_id, u_da);
    END LOOP;
END $$;

-- Archivos Adjuntos
DO $$
DECLARE
    role_user_id BIGINT;
    t_id BIGINT;
    counter INT := 1;
BEGIN
    FOR role_user_id IN (SELECT id FROM users) LOOP
        -- Tomar las primeras 3 tareas asignadas a este usuario
        FOR t_id IN (
            SELECT t.id FROM tasks t
            JOIN task_assignees ta ON t.id = ta.task_id
            WHERE ta.user_id = role_user_id
            LIMIT 3
        ) LOOP
            INSERT INTO task_attachments (file_name, file_type, file_path, task_id)
            VALUES (
                'Gato_' || counter || '.png',
                'image/png',
                'uploads/gato_' || ((counter % 17) + 1) || '.png',
                t_id
            );
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;
