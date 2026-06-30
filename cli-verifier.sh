#!/bin/bash

# Script para probar los endpoints del backend usando curl.

API_URL="http://localhost:8080/api"
TOKEN=""
CURRENT_USER="Ninguno"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

function print_header() {
    clear
    echo -e "${BLUE}=============================================${NC}"
    echo -e "${CYAN}   TO-DO JAVA - CLI "${NC}
    echo -e "${BLUE}=============================================${NC}"
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}[+] Estado: Conectado como $CURRENT_USER${NC}"
    else
        echo -e "${RED}[!] Estado: Desconectado${NC}"
    fi
    echo -e "${BLUE}=============================================${NC}"
}

function check_auth() {
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}[ERROR] Necesitas iniciar sesion (Opcion 1) antes de hacer esto.${NC}"
        read -p "Presiona Enter para continuar..."
        return 1
    fi
    return 0
}

function list_available_users() {
    echo -e "${YELLOW}Usuarios disponibles en el sistema:${NC}"
    echo -e " 1) pm@devteam.com       (Project Manager)"
    echo -e " 2) senior@devteam.com   (Senior Dev)"
    echo -e " 3) junior@devteam.com   (Junior Dev)"
    echo -e " 4) backend@devteam.com  (Backend Dev)"
    echo -e " 5) frontend@devteam.com (Frontend Dev)"
    echo -e " 6) devops@devteam.com   (DevOps)"
    echo -e " 7) machinelearning@devteam.com (ML)"
    echo -e " 8) data@devteam.com     (Data Analyst)"
    echo -e " * La contrasena para todos es: ${GREEN}123${NC}\n"
}

function preview_tasks() {
    echo -e "${YELLOW}>> Cargando resumen de tus tareas actuales...${NC}"
    response=$(curl -s -X GET "$API_URL/tasks" -H "Authorization: Bearer $TOKEN")
    
    if command -v jq &> /dev/null; then
        echo -e "${CYAN}--- TUS TAREAS DISPONIBLES ---${NC}"
        # Filtramos para mostrar solo un preview amigable
        echo "$response" | jq -r 'if length > 0 then .[] | " ID: \(.id) | Titulo: \(.title) | Estado: \(.status)" else " [!] No tienes tareas asignadas." end'
        echo -e "------------------------------\n"
    else
        echo -e "${RED}[!] JQ no instalado, no se puede generar el preview. JSON:${NC}"
        echo "$response"
    fi
}

function ask_status() {
    echo -e "${CYAN}Selecciona el Estado de la Tarea:${NC}"
    echo " 1) PENDIENTE"
    echo " 2) EN_PROGRESO"
    echo " 3) COMPLETADA"
    read -p "Opcion (1-3) [Default: 1]: " st_opt
    case $st_opt in
        2) SELECTED_STATUS="EN_PROGRESO" ;;
        3) SELECTED_STATUS="COMPLETADA" ;;
        *) SELECTED_STATUS="PENDIENTE" ;;
    esac
    echo -e "${YELLOW}>> Estado seleccionado: $SELECTED_STATUS${NC}\n"
}

function login() {
    echo -e "\n${CYAN}--- INICIAR SESION ---${NC}"
    list_available_users
    
    read -p "Email del usuario: " email
    read -s -p "Password: " password
    echo ""

    echo -e "${YELLOW}>> Enviando POST a $API_URL/auth/login...${NC}"
    response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")

    if [[ $response == *"token"* ]]; then
        TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
        CURRENT_USER=$email
        echo -e "${GREEN}[OK] Login Exitoso! JWT almacenado.${NC}"
    else
        echo -e "${RED}[ERROR] Fallo el login:${NC}"
        echo "$response"
    fi
    read -p "Presiona Enter para continuar..."
}

function logout() {
    TOKEN=""
    CURRENT_USER="Ninguno"
    echo -e "${GREEN}[OK] Sesion cerrada exitosamente.${NC}"
    sleep 1
}

function get_tasks() {
    echo -e "\n${CYAN}--- LEER TAREAS (DETALLE) ---${NC}"
    check_auth || return

    echo -e "${YELLOW}>> Enviando GET a $API_URL/tasks...${NC}"
    response=$(curl -s -X GET "$API_URL/tasks" -H "Authorization: Bearer $TOKEN")

    if command -v jq &> /dev/null; then
        echo "$response" | jq .
    else
        echo "$response"
    fi
    read -p "Presiona Enter para continuar..."
}

function create_task() {
    echo -e "\n${CYAN}--- CREAR NUEVA TAREA ---${NC}"
    check_auth || return

    read -p "Titulo de la tarea: " title
    read -p "Descripcion breve: " desc
    
    ask_status
    
    list_available_users
    echo -e "${CYAN}Asigna usuarios por ID separados por coma (ej: 1,2). Vacio = tu mismo.${NC}"
    read -p "IDs asignados: " assignees
    
    assignees_json=${assignees:-"[]"}
    [[ "$assignees_json" != "[]" ]] && assignees_json="[$assignees]"

    echo -e "\n${YELLOW}>> Enviando POST a $API_URL/tasks...${NC}"
    response=$(curl -s -X POST "$API_URL/tasks" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"$title\",\"description\":\"$desc\",\"status\":\"$SELECTED_STATUS\",\"dueDate\":\"2027-01-01\",\"assigneeIds\":$assignees_json}")

    echo -e "${GREEN}[OK] Tarea Creada:${NC}"
    if command -v jq &> /dev/null; then echo "$response" | jq .; else echo "$response"; fi
    read -p "Presiona Enter para continuar..."
}

function update_task() {
    echo -e "\n${CYAN}--- ACTUALIZAR TAREA ---${NC}"
    check_auth || return
    preview_tasks

    read -p "ID de Tarea a actualizar (Enter para cancelar): " task_id
    if [ -z "$task_id" ]; then echo "Cancelado."; return; fi
    
    read -p "Nuevo Titulo: " title
    read -p "Nueva Descripcion: " desc
    
    ask_status

    list_available_users
    echo -e "${CYAN}Para no modificar los usuarios asignados, deja esto vacio.${NC}"
    read -p "Nuevos IDs asignados (ej: 1,3): " assignees
    
    assignees_json=${assignees:-"null"}
    [[ "$assignees_json" != "null" ]] && assignees_json="[$assignees]"

    echo -e "\n${YELLOW}>> Enviando PUT a $API_URL/tasks/$task_id...${NC}"
    response=$(curl -s -X PUT "$API_URL/tasks/$task_id" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"$title\",\"description\":\"$desc\",\"status\":\"$SELECTED_STATUS\",\"dueDate\":\"2027-01-01\",\"assigneeIds\":$assignees_json}")

    echo -e "${GREEN}[OK] Respuesta del Servidor:${NC}"
    if command -v jq &> /dev/null; then echo "$response" | jq .; else echo "$response"; fi
    read -p "Presiona Enter para continuar..."
}

function delete_task() {
    echo -e "\n${CYAN}--- ELIMINAR TAREA ---${NC}"
    check_auth || return
    preview_tasks

    read -p "Ingresa el ID de la Tarea a eliminar (Enter para cancelar): " task_id
    if [ -z "$task_id" ]; then echo "Cancelado."; return; fi
    
    echo -e "${YELLOW}>> Enviando DELETE a $API_URL/tasks/$task_id...${NC}"
    response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/tasks/$task_id" \
        -H "Authorization: Bearer $TOKEN")

    if [ "$response" == "204" ]; then
        echo -e "${GREEN}[OK] Tarea $task_id eliminada correctamente.${NC}"
    else
        echo -e "${RED}[ERROR] HTTP Code: $response${NC}"
    fi
    read -p "Presiona Enter para continuar..."
}

function add_attachment() {
    echo -e "\n${CYAN}--- SUBIR ADJUNTO ---${NC}"
    check_auth || return
    preview_tasks

    read -p "ID de la Tarea (Enter para cancelar): " task_id
    if [ -z "$task_id" ]; then echo "Cancelado."; return; fi
    
    read -p "Nombre para el archivo dummy (ej: reporte.txt): " filename
    if [ -z "$filename" ]; then filename="documento_prueba.txt"; fi
    
    filepath="./$filename"
    echo -e "${YELLOW}Generando archivo local temporal en $filepath...${NC}"
    echo "Contenido de prueba autogenerado para el archivo $filename." > "$filepath"

    echo -e "${YELLOW}>> Enviando POST (multipart/form-data) a $API_URL/tasks/$task_id/attachments...${NC}"
    response=$(curl -s -X POST "$API_URL/tasks/$task_id/attachments" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$filepath")

    echo -e "${GREEN}[OK] Respuesta:${NC}"
    if command -v jq &> /dev/null; then echo "$response" | jq .; else echo "$response"; fi
    read -p "Presiona Enter para continuar..."
}

while true; do
    print_header
    echo "  1) Iniciar Sesion (Login / AuthController)"
    echo "  2) Ver Mis Tareas (GET / Detalle JSON)"
    echo "  3) Crear Tarea    (POST / TaskService)"
    echo "  4) Editar Tarea   (PUT / TaskService)"
    echo "  5) Eliminar Tarea (DELETE / TaskService)"
    echo "  6) Subir Adjunto  (POST multipart)"
    echo "  7) Cerrar Sesion  (Limpiar Local Storage/Memoria)"
    echo "  8) Salir del programa"
    echo ""
    read -p "Opcion (1-8): " opt

    case $opt in
        1) login ;;
        2) get_tasks ;;
        3) create_task ;;
        4) update_task ;;
        5) delete_task ;;
        6) add_attachment ;;
        7) logout ;;
        8) echo "Saliendo..."; exit 0 ;;
        *) echo -e "${RED}Opcion invalida.${NC}"; sleep 1 ;;
    esac
done
