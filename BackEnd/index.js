const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Tarea = require('./models/Tarea'); // Importamos el modelo
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB (usaremos una base de datos local o de Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/gestorTareas')
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

// 1. OBTENER TAREAS
app.get('/api/tareas', async (req, res) => {
    const tareas = await Tarea.find();
    res.json(tareas);
});

// 2. AGREGAR TAREA
app.post('/api/tareas', async (req, res) => {
    const nuevaTarea = new Tarea({ texto: req.body.texto });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
});

// 3. EDITAR / COMPLETAR
app.put('/api/tareas/:id', async (req, res) => {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
});

// 4. ELIMINAR TAREA
app.delete('/api/tareas/:id', async (req, res) => {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarea eliminada" });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));