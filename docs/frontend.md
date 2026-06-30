# Arquitectura del Frontend: todo-java

Este documento detalla la estructura, tecnologías, decisiones arquitectónicas y el diseño visual de la interfaz de usuario (Frontend) de la aplicación **todo-java**.

## 1. Tecnologías Utilizadas
- **Framework**: [Angular 18](https://angular.dev/) (Arquitectura basada estrictamente en *Standalone Components*).
- **Lenguaje**: TypeScript.
- **Estilos**: SCSS nativo (Sass) para mayor control de variables y anidación.
- **Interacciones Avanzadas**: `@angular/cdk/drag-drop` (Drag & Drop para el módulo Kanban).

---

## 2. Paleta de Colores de pagina de gobierno
- **Colores Institucionales**: Se utiliza una paleta vibrante (`Guinda`, `Magenta`, `Teal`, `Indigo`, `Yellow`) basada en la pagina de oaxaca y su logotipo

---

## 3. Módulos del Sistema (Desglose Lógico)

### 3.1 Módulo de Conexión con la API (`core/`)
Este es el "motor" de comunicación del Frontend con el Backend en Java Spring Boot.
- **`AuthService`**: Gestiona las peticiones de Login y Registro (`/api/auth/*`). Guarda el token JWT en el `localStorage` y administra el ciclo de sesión.
- **`TaskService`**: Emite las peticiones CRUD de las tareas (`/api/tasks/*`) y maneja el estado global y reactivo usando `BehaviorSubject`. Incluye la lógica particular para subir los archivos binarios (`FormData`) al backend.
- **`AuthInterceptor`**: Se coloca "en medio" de cada petición HTTP saliente para inyectar automáticamente el header `Authorization: Bearer <token>`, evitando tener que mandarlo manualmente en cada consulta.

### 3.2 Módulo de Componentes Globales (`shared/components/`)
Piezas de interfaz de usuario "tontas" o altamente reutilizables en cualquier parte de la app.
- **`SidebarComponent`**: Barra de navegación fija con los iconos principales, encargada de mutar el `ViewService` para cambiar las pantallas sin recargar la web.
- **`ErrorBannerComponent`**: Pequeña tira que se muestra globalmente para anunciar un error capturado en el interceptor.
- **`SpinnerComponent`**: Componente visual puro para indicar cargas.

### 3.3 Módulo de Vistas / Features (`features/`)
Pantallas complejas atadas a lógica de negocio (Smart Components).

**Vistas de Autenticación (`features/auth/`)**:
- **`LoginComponent`**: Pantalla de inicio de sesión de doble panel. Maneja los formularios reactivos y bloqueos mientras el API valida.
- **`RegisterComponent`**: Flujo de registro de cuenta.

**Vistas de Tableros / Tareas (`features/tasks/`)**:
- **`TaskBoardComponent` (Orquestador principal)**: Decide, con base en el menú lateral, cuál de los siguientes "tableros hijos" debe renderizarse en pantalla mediante un `[ngSwitch]`.
- **`TaskList`**: Vista lineal clásica tipo lista con thumbnails.
- **`KanbanBoard`**: Tres columnas interactuables con tecnología drag-and-drop y visualización de portadas (covers).
- **`StickyBoard`**: Muro de ideas tipo post-its.
- **`DiagramView`**: Panel esquemático donde las tareas figuran como nodos conectados hacia un rol central.
- **`CalendarBoard`**: Grilla de CSS que funciona como calendario mensual clásico, abriendo ventanas superpuestas (Modales) para consultar qué hacer cada día.

---

## 4. Árbol de Archivos del Frontend y Descripción

El proyecto sigue una arquitectura **Feature-Driven (Modular por dominio)**, separando la infraestructura global de la lógica de negocio.

```text
frontend/src/app/
├── core/                   # [CEREBRO GLOBAL] Lógica que vive durante todo el ciclo de vida de la app
│   ├── guards/             # Protecciones de rutas (Ej. auth.guard.ts para evitar accesos sin token)
│   ├── interceptors/       # Middleware HTTP (Ej. inyectar el token JWT en cada petición a la API)
│   └── services/           # Conexiones con la API de Java (AuthService, TaskService) y gestión de estados (ViewService)
│
├── shared/                 # [COMPONENTES REUTILIZABLES] Piezas UI genéricas
│   ├── components/         
│   │   ├── error-banner/   # Alertas globales de error
│   │   ├── sidebar/        # Barra de Navegación principal (Navbar)
│   │   └── spinner/        # Loader global de carga
│   └── styles/             # Hojas de estilo maestras y variables SCSS institucionales
│
├── features/               # [MÓDULOS DE NEGOCIO] 
│   ├── auth/               # Dominio de autenticación
│   │   ├── login/          # Interfaz de Login con layout dividido (Split Screen) e imagen de Huipil
│   │   └── register/       # Formulario de alta de usuario
│   │
│   └── tasks/              # Dominio principal de gestión de tareas
│       ├── models/         # Interfaces de TypeScript (Task, TaskStatus)
│       ├── task-board/     # [ORQUESTADOR] Componente padre que inyecta las sub-vistas dinámicamente
│       ├── task-card/      # Tarjeta estándar (Vista de Lista)
│       ├── task-form/      # Formulario Modal para Crear/Editar (soporta imágenes locales en caché)
│       │
│       ├── sticky-board/   # Vista de Muro: Notas adhesivas gigantes con cálculo de luma
│       ├── kanban-board/   # Vista Kanban: Tableros interactivos (Drag & Drop)
│       ├── calendar-board/ # Vista de Calendario: Grid mensual de CSS con popups modales de eventos
│       └── diagram-view/   # Vista de Nodos: Agrupación gráfica de tareas por Roles o Etiquetas
│
├── app.component.ts        # Raíz de la app (Inyecta el router-outlet y el Sidebar)
└── app.routes.ts           # Definición del enrutamiento
```

---

## 5. Patrones de Diseño y Lógica de Flujo

### 5.1 Persistencia de Estado (Reactivismo)
Se evitó que cada vista llame independientemente a la API. En su lugar, el `TaskService` funciona como un almacén de estado único (Single Source of Truth) utilizando `BehaviorSubject`.
- **¿Por qué?**: Cuando la aplicación arranca o sufre un cambio, el orquestador (`task-board`) invoca a la API. Todos los sub-componentes (lista, kanban, calendario) están "suscritos" reactivamente a esa misma variable en memoria. Esto garantiza que un cambio visual se propague instantáneamente por toda la aplicación sin necesidad de recargar peticiones a base de datos.

### 5.2 Orquestador de Vistas (TaskBoard)
Se implementó un patrón de orquestación donde `task-board` rige el `[ngSwitch]` principal.
- **¿Por qué?**: Evita problemas de dependencias circulares. En lugar de navegar en la URL entre tableros, el `TaskBoard` recibe la señal del `ViewService` (gatillada por la Navbar) e intercambia el DOM destruyendo e inicializando rápidamente el componente `kanban`, `calendar`, etc. 

### 5.3 Manejo de Imágenes Adjuntas (Attachments)
La API de Java retorna un objeto JSON, pero para las imágenes requiere un multipart/form-data.
- **Flujo**: El componente `task-form` mantiene el archivo seleccionado en memoria local. Al enviar, primero se guarda la entidad de texto de la Tarea, una vez Java retorna el `ID`, el frontend detona automáticamente una segunda petición silenciosa subiendo la imagen al volumen de Docker persistente `/uploads/` y actualizando el estado reactivo global. 

### 5.4 Persistencia de Caché de Input
Se implementó una lógica de `reset` estricto en el formulario de creación.
- **¿Por qué?**: Al estar inyectado como Modal, el componente no se destruye totalmente de memoria. Fue crucial implementar `this.selectedFile = undefined` al guardar o cancelar, para evitar que una tarea nueva herede accidentalmente la imagen de una tarea previa.
