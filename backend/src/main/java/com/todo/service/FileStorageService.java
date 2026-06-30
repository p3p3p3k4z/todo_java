package com.todo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Maneja el guardado fisico de los archivos subidos.
 * Crea una carpeta llamada "uploads" y mete ahi cualquier archivo que el usuario suba, 
 * devolviendo la ruta exacta para que podamos guardarla en la base de datos.
 * 
 * Si subes 'foto.png', este archivo la guarda en '/uploads/123-foto.png' y le dice al 
 * TaskService donde la puso para que lo anote en la base de datos.
 */
@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        // Carpeta donde se guardaran los archivos (relativa a la raiz del proyecto)
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio donde los archivos subidos seran almacenados.", ex);
        }
    }

    /**
     * Guarda un archivo en el disco y devuelve la ruta relativa.
     */
    public String storeFile(MultipartFile file) {
        // Generar un nombre unico para evitar colisiones
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        try {
            // Chequear caracteres invalidos
            if(fileName.contains("..")) {
                throw new RuntimeException("El nombre de archivo contiene una secuencia de ruta invalida " + fileName);
            }

            // Copiar el archivo al directorio de destino (Reemplazando el archivo existente con el mismo nombre)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retornar la ruta relativa o nombre para guardarlo en la DB
            return "uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo almacenar el archivo " + fileName + ". Por favor, intente nuevamente!", ex);
        }
    }
}
