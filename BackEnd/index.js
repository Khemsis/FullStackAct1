const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Cambiamos a 'let' para poder modificar el arreglo en memoria
let tareas = [
    { id: 1, texto: "Instalar Node.js", hecha: true },
    { id: 2, texto: "Crear el Backend", hecha: true },
    { id: 3, texto: "Crear el Frontend", hecha: false }
];

// 1. OBTENER TAREAS (GET)
app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

// 2. AGREGAR TAREA (POST)
app.post('/api/tareas', (req, res) => {
    const nuevaTarea = {
        id: Date.now(), // Genera un ID único basado en el tiempo actual
        texto: req.body.texto,
        hecha: false
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea); // Respondemos con la tarea creada
});

// 3. EDITAR / MARCAR COMO COMPLETADA (PUT)
app.put('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);
    
    if (tarea) {
        // Si nos mandan 'hecha', lo actualizamos (invierte el estado), si mandan texto nuevo también
        if (req.body.hecha !== undefined) tarea.hecha = req.body.hecha;
        if (req.body.texto !== undefined) tarea.texto = req.body.texto;
        res.json(tarea);
    } else {
        res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
});

// 4. ELIMINAR TAREA (DELETE)
app.delete('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tareas = tareas.filter(t => t.id !== id);
    res.json({ mensaje: "Tarea eliminada con éxito" });
});

app.listen(3000, () => {
    console.log('✅ El servidor está corriendo en http://localhost:3000');
});