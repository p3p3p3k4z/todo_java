# Reporte de Evaluacion Heuristica

## Introduccion a las 10 Heuristicas de Nielsen en HCI y UI/UX
Las 10 heuristicas de Jakob Nielsen son principios fundamentales de diseno de interfaces de usuario. En el campo de la Interaccion Humano-Computadora (HCI), estas heuristicas no son reglas estrictas, sino guias empiricas que dictan como los sistemas deben interactuar con las limitaciones y fortalezas de la psicologia humana (ej. memoria a corto plazo, atencion, y percepcion). 

En el diseño de UI/UX, sirven como una herramienta de diagnostico rapida y economica (Heuristic Evaluation) para encontrar problemas de usabilidad antes de realizar pruebas costosas con usuarios reales. Un sistema ideal busca alinear estas guias con los objetivos del negocio para producir interfaces amigables, consistentes y perdonadoras ante el error.

Este reporte detalla la evaluacion heuristica aplicada a la interfaz de gestion de tareas de la aplicacion. Cabe recalcar que ningun sistema cumple a la perfeccion las 10 heuristicas, pero sirven como guia iterativa de mejora.

## 1. Visibilidad del estado del sistema
**Aplicacion / Oportunidad de mejora:** Se incluyo el componente `SpinnerComponent` que muestra retroalimentacion visual cuando el sistema se comunica con la API. Adicionalmente, al mover una tarjeta en la vista Kanban, esta se refleja instantaneamente en la nueva columna. En el futuro, se podria agregar un "toast notification" (mensaje emergente corto) en la esquina superior cuando una tarea cambie de estado o se asigne con exito, en lugar de mutar la pantalla en silencio.

## 2. Relacion entre el sistema y el mundo real
**Aplicacion / Oportunidad de mejora:** Se emplean terminos comunes (Pendiente, Completada) y analogias como Kanban (Tablero) y Notas Adhesivas (Sticky Board), que los usuarios reconocen del mundo fisico y de entornos de oficina. Para mejorar esto a futuro, los avatares o perfiles de usuario podrian mostrar una imagen real del colaborador en lugar de solo listar sus correos, acercando mas el sistema a interacciones humanas reales.

## 3. Control y libertad del usuario
**Aplicacion / Oportunidad de mejora:** El usuario tiene libertad para alternar entre diferentes vistas (Lista, Tablero, Notas, Calendario, Diagrama) usando los controles de la barra lateral. Al editar una tarea, el boton "Cancelar" descarta los cambios y regresa al estado original sin penalizaciones. En el futuro, se deberia implementar un boton de "Deshacer" (Undo) justo despues de eliminar una tarea o moverla accidentalmente en el Kanban, dandole aun mas red de seguridad al usuario.

## 4. Consistencia y estandares
**Aplicacion / Oportunidad de mejora:** Se siguio un sistema de diseno consistente. Las tareas en "Pendiente" siempre comparten su color distintivo, al igual que "En Progreso" y "Completadas" a traves del Kanban y de las Notas. En futuras iteraciones, se podria estandarizar la forma en que los botones flotantes de accion (como Editar o Eliminar) aparecen en las tarjetas, ya que en ciertas vistas compiten visualmente con la descripcion de la tarea.

## 5. Prevencion de errores
**Aplicacion / Oportunidad de mejora:** Los formularios usan validadores (`Reactive Forms`) que deshabilitan los botones principales hasta que la informacion ingresada cumpla los minimos requeridos. Asimismo, las acciones criticas como borrar despliegan una confirmacion explicita (`confirm()` prompt del navegador). Para mejorar, en vez de la alerta por defecto del navegador, se deberia crear un Modal de Confirmacion personalizado con un diseno claro para evitar que el usuario lo ignore por costumbre.

## 6. Reconocer antes que recordar
**Aplicacion / Oportunidad de mejora:** En el formulario de edicion de tareas, los campos vienen pre-poblados con la informacion original. En la vista Kanban y Diagrama, el uso de iconos (como el CheckCircle o el Edit) reduce la necesidad de leer texto. A futuro, podria integrarse un historial de tareas recientes, permitiendo al usuario retomar su trabajo del dia anterior sin necesidad de buscar o recordar que estaba haciendo.

## 7. Flexibilidad y eficiencia de uso
**Aplicacion / Oportunidad de mejora:** El sistema implementa la funcionalidad de arrastrar y soltar (Drag & Drop) en el Kanban, lo que actua como un acelerador para usuarios experimentados. La vista de Diagrama facilita el analisis rapido por parte de los administradores. En el futuro, la aplicacion podria incluir "atajos de teclado" (shortcuts) para crear tareas rapidas (e.g. presionar la tecla 'C') y filtros preguardados de busqueda.

## 8. Diseno estetico y minimalista
**Aplicacion / Oportunidad de mejora:** Las vistas de Login y de Notas utilizan fondos planos y estructurados, resaltando unicamente los colores accionables o de estado. Las imagenes de las tareas (como los gatos adjuntos) brindan identidad sin desordenar la jerarquia visual. A futuro, se podria reducir un poco mas la cantidad de informacion que se muestra en el preview de cada tarjeta del Kanban, escondiendo textos largos tras un boton de "Ver mas..." para mantener el tablero ordenado y minimalista.

## 9. Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores
**Aplicacion / Oportunidad de mejora:** Los errores de autenticacion y las respuestas fallidas del API se muestran a traves del `ErrorBannerComponent` (por ejemplo, "Fallo al subir la imagen"). En proximas versiones, el sistema podria proveer soluciones mas especificas en lugar de solo mostrar el error; por ejemplo, si la imagen falla por tamano, el banner deberia decir "La imagen supera los 5MB, intenta con una mas pequena", ayudando a la recuperacion inmediata.

## 10. Ayuda y documentacion
**Aplicacion / Oportunidad de mejora:** Aunque las interfaces (Kanban, Notas, Login) estan disenadas de manera intuitiva y reducen la necesidad de manuales, existe documentacion a nivel de repositorio. Para los usuarios finales de la aplicacion, seria util incluir pequenos "Tooltips" (textos de ayuda al pasar el mouse) en la vista de Diagrama o Kanban, explicando brevemente que significa cada color o funcionalidad de filtrado.
