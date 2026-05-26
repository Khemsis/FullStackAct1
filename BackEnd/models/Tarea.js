const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
    texto: { type: String, required: true },
    hecha: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tarea', TareaSchema);