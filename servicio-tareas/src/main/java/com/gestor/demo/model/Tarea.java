package com.gestor.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tareas")
public class Tarea {
    
    @Id
    private String id;
    private String texto;
    private boolean hecha;
    
    private String urgencia; 
    private String idUsuario;
    private String idProyecto;

    public Tarea() {}

    public Tarea(String texto, boolean hecha, String urgencia) {
        this.texto = texto;
        this.hecha = hecha;
        this.urgencia = urgencia;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    
    public boolean isHecha() { return hecha; }
    public void setHecha(boolean hecha) { this.hecha = hecha; }

    public String getUrgencia() { return urgencia; }
    public void setUrgencia(String urgencia) { this.urgencia = urgencia; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getIdProyecto() { return idProyecto; }
    public void setIdProyecto(String idProyecto) { this.idProyecto = idProyecto; }
}