package com.gestor.demo.controller;

import com.gestor.demo.model.Tarea;
import com.gestor.demo.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:5173") 
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @GetMapping
    public List<Tarea> obtenerTodas() {
        return tareaRepository.findAll();
    }

    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea nuevaTarea) {
        return tareaRepository.save(nuevaTarea);
    }

    @DeleteMapping("/{id}")
    public void eliminarTarea(@PathVariable String id) {
        tareaRepository.deleteById(id);
    }
}