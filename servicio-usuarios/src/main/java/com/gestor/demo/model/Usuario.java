package com.gestor.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Usuario {
    
    @Id
    private String id;
    private String nombre;
    private String rol; // Ej: "Desarrollador", "Diseñador", "Project Manager"

    // Constructores
    public Usuario() {}

    public Usuario(String nombre, String rol) {
        this.nombre = nombre;
        this.rol = rol;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}