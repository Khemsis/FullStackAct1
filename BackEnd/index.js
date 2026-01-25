const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const tareas = [
    { id: 1, texto: "Instalar Node.js", hecha: true },
    { id: 2, texto: "Crear el Backend", hecha: true },
    { id: 3, texto: "Crear el Frontend", hecha: false }
];

app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

app.listen(3000, () => {
    console.log('✅ El servidor está corriendo en http://localhost:3000');
});