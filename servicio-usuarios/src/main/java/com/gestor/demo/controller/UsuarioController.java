package com.gestor.demo.controller;

import com.gestor.demo.model.Usuario;
import com.gestor.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener la lista de todos los usuarios
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Registrar un nuevo usuario
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario nuevoUsuario) {
        return usuarioRepository.save(nuevoUsuario);
    }

    // Eliminar un usuario del equipo
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable String id) {
        usuarioRepository.deleteById(id);
    }
}