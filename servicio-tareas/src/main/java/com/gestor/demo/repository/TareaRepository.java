package com.gestor.demo.repository;

import com.gestor.demo.model.Tarea;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TareaRepository extends MongoRepository<Tarea, String> {
    List<Tarea> findByUrgencia(String urgencia);
    List<Tarea> findByIdUsuario(String idUsuario);
}