-- Password for all users is '123' (Texto plano, sin encriptar)
INSERT INTO users (email, password, role) VALUES 
('pm@devteam.com', '123', 'PM'),
('senior@devteam.com', '123', 'SR'),
('junior@devteam.com', '123', 'JR'),
('backend@devteam.com', '123', 'BACKEND'),
('frontend@devteam.com', '123', 'FRONTEND'),
('devops@devteam.com', '123', 'DEVOPS'),
('machinelearning@devteam.com', '123', 'ML'),
('data@devteam.com', '123', 'DATA_ANALYST');

INSERT INTO tasks (title, description, status, due_date, user_id) VALUES 
('Planificacion de Adjuntos', 'Definir historias de usuario para que la App To-Do soporte subida de imagenes y PDFs', 'COMPLETADA', '2026-06-01', (SELECT id FROM users WHERE email='pm@devteam.com')),
('Revision de Arquitectura Base', 'Aprobar modelo ER de PostgreSQL y uso de Standalone Components en Angular 16', 'COMPLETADA', '2026-06-05', (SELECT id FROM users WHERE email='senior@devteam.com')),
('CSS Kanban Board', 'Solucionar el contraste de la paleta institucional (guinda/magenta) en las tarjetas de tareas', 'EN_PROGRESO', '2026-06-15', (SELECT id FROM users WHERE email='junior@devteam.com')),
('Desarrollo de FileStorageService', 'Escribir el servicio en Spring Boot para guardar binarios en la carpeta /uploads', 'PENDIENTE', '2026-07-01', (SELECT id FROM users WHERE email='backend@devteam.com')),
('Interceptor JWT Angular', 'Implementar interceptor HTTP para inyectar el token Bearer en peticiones al backend', 'EN_PROGRESO', '2026-06-20', (SELECT id FROM users WHERE email='frontend@devteam.com')),
('Dockerizacion Completa', 'Configurar docker-compose.yml integrando Postgres, Spring Boot y Nginx', 'COMPLETADA', '2026-06-10', (SELECT id FROM users WHERE email='devops@devteam.com')),
('Priorizacion Inteligente', 'Integrar modelo de NLP para auto-clasificar la urgencia de una tarea segun su descripcion', 'PENDIENTE', '2026-07-30', (SELECT id FROM users WHERE email='machinelearning@devteam.com')),
('Dashboard de Productividad', 'Extraer metricas de tareas completadas VS pendientes para evaluar al equipo', 'PENDIENTE', '2026-07-10', (SELECT id FROM users WHERE email='data@devteam.com'));
