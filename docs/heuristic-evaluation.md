# Reporte de Evaluacion Heuristica

Este reporte detalla la evaluacion heuristica basada en los 10 principios de Jakob Nielsen aplicada a la interfaz de gestion de tareas de la aplicacion "To-Do Fullstack".

## 1. Visibilidad del estado del sistema
**Aplicacion:** Se incluyo el componente `SpinnerComponent` que muestra retroalimentacion visual animada cada vez que el sistema se comunica de manera asincrona (API request). De igual manera, los errores se exponen claramente usando el `ErrorBannerComponent`. 
**Resultado:** Cumple adecuadamente. El usuario siempre sabe si el sistema esta procesando su peticion.

## 2. Relacion entre el sistema y el mundo real
**Aplicacion:** Se emplean terminos comunes (List View, Board View, Pendiente, Completada) y analogias como Kanban (Tablero) que los usuarios ya comprenden de herramientas de productividad fisicas o populares.
**Resultado:** Cumple adecuadamente.

## 3. Control y libertad del usuario
**Aplicacion:** El usuario tiene total libertad para alternar entre "Vista Lista" y "Vista Tablero" usando un solo boton, sin perder su contexto de filtrado. Al editar una tarea, el boton "Cancel" descarta los cambios y regresa al estado original sin penalizaciones.
**Resultado:** Cumple adecuadamente.

## 4. Consistencia y estandares
**Aplicacion:** Se siguio estrictamente un sistema de diseno basado en colores institucionales. Las tareas en "Pendiente" siempre comparten el tono magenta, "En Progreso" el dorado/amarillo y "Completadas" el verde. Esto reduce significativamente la carga cognitiva.
**Resultado:** Cumple adecuadamente.

## 5. Prevencion de errores
**Aplicacion:** Los formularios implementados con `Reactive Forms` incluyen validadores que deshabilitan el boton principal (`disabled` state) hasta que los datos cumplan las condiciones minimas. Adicionalmente, las acciones criticas como borrar una tarea despliegan una confirmacion explicita en el navegador.
**Resultado:** Cumple adecuadamente.

## 6. Reconocer antes que recordar
**Aplicacion:** En el formulario de edicion de tareas, los campos vienen pre-poblados (patchValue) con la informacion original. En lugar de pintar todo el fondo de las tarjetas de colores fuertes, se opto por bordes laterales (`border-left`) para indicar estados, permitiendo al usuario reconocer las categorias por su color sin abrumar visualmente la lectura del texto.
**Resultado:** Cumple adecuadamente. Reduce la saturacion y facilita la escaneabilidad.

## 7. Flexibilidad y eficiencia de uso
**Aplicacion:** El `statusFilter` implementa busqueda reactiva que actualiza la lista/tablero inmediatamente. Los usuarios experimentados pueden usar la vista Tablero para tener todo el contexto global, y los mas novatos pueden ver una lista filtrada paso a paso.
**Resultado:** Cumple adecuadamente.

## 8. Diseno estetico y minimalista
**Aplicacion:** La interfaz utiliza el fondo blanco (`--color-bg-surface`) y gris claro (`--color-bg-main`) como descansos visuales. Solo la informacion accionable (titulos y etiquetas) porta color de la paleta.
**Resultado:** Cumple adecuadamente.

## 9. Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores
**Aplicacion:** Las respuestas de error del interceptor y `GlobalExceptionHandler` se capturan en el UI y se muestran a traves del `ErrorBannerComponent` indicando con claridad cual fue el fallo (ej. Login failed, Access Denied) usando texto rojo oscuro (`--color-brand-magenta`).
**Resultado:** Cumple adecuadamente.

## 10. Ayuda y documentacion
**Aplicacion:** Todo ha sido disenado para ser intuitivo y libre de manuales, pero la configuracion y documentacion esta centralizada en el archivo `README.md`.
**Resultado:** Cumple adecuadamente.

## Conclusion sobre Carga Cognitiva
La combinacion de Standalone Components con un sistema estricto de variables SCSS garantiza que el usuario experimente una navegacion fluida. La decision de limitar la "codificacion por color" unicamente al borde lateral (`border-left`) y titulos mejora el ratio de contraste WCAG AA, manteniendo los cuerpos de texto en tonos neutros oscuros (`#121212` y `#595959`) sobre fondo blanco, lo cual alivia la fatiga visual al manejar cientos de tareas.
