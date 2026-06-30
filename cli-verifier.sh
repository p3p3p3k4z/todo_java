#!/bin/bash

# To-Do API CLI Verifier
# Script para probar los endpoints del backend usando curl.

API_URL="http://localhost:8080/api"
TOKEN=""

function print_header() {
    echo "============================================="
    echo "   TO-DO BACKEND CLI VERIFIER "
    echo "============================================="
}

function login() {
    echo -e "\n--- LOGIN ---"
    read -p "Email: " email
    read -s -p "Password: " password
    echo ""

    # Hacemos la peticion a la API y extraemos el token usando grep y sed (simulando parsing basico JSON)
    response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")

    if [[ $response == *"token"* ]]; then
        # Extraer el token de forma cruda
        TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
        echo "[OK] Login Exitoso!"
        echo "Token guardado en memoria."
    else
        echo "[ERROR] Fallo el login. Respuesta del servidor:"
        echo "$response"
    fi
}

function get_tasks() {
    echo -e "\n--- MIS TAREAS ---"
    if [ -z "$TOKEN" ]; then
        echo "[ERROR] Necesitas hacer login primero."
        return
    fi

    response=$(curl -s -X GET "$API_URL/tasks" \
        -H "Authorization: Bearer $TOKEN")

    # Formateo basico para consola usando 'jq' si esta instalado, sino impresion cruda
    if command -v jq &> /dev/null; then
        echo "$response" | jq .
    else
        echo "$response"
    fi
}

function create_task() {
    echo -e "\n--- NUEVA TAREA ---"
    if [ -z "$TOKEN" ]; then
        echo "[ERROR] Necesitas hacer login primero."
        return
    fi

    read -p "Titulo: " title
    read -p "Descripcion: " desc
    
    response=$(curl -s -X POST "$API_URL/tasks" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"$title\",\"description\":\"$desc\",\"status\":\"PENDIENTE\",\"dueDate\":\"2027-01-01\"}")

    echo "[OK] Tarea Creada:"
    echo "$response"
}

# Menu Principal
while true; do
    echo ""
    print_header
    echo "Opciones:"
    echo "1. Iniciar Sesion (Login)"
    echo "2. Ver Mis Tareas"
    echo "3. Crear Tarea"
    echo "4. Salir"
    read -p "Elige una opcion (1-4): " opt

    case $opt in
        1) login ;;
        2) get_tasks ;;
        3) create_task ;;
        4) echo "Saliendo..."; exit 0 ;;
        *) echo "Opcion invalida." ;;
    esac
done

