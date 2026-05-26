// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [error, setError] = useState(null)
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('')

  const cargarTareas = () => {
    fetch('http://localhost:3000/api/tareas')
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar')
        return response.json()
      })
      .then(data => {
        setTareas(data) // MongoDB nos devuelve un arreglo de objetos con _id
        setError(null)
      })
      .catch(err => {
        console.error(err)
        setError('¡Error! Asegúrate de que el Backend esté corriendo.')
      })
  }

  useEffect(() => {
    cargarTareas()
  }, [])

  const agregarTarea = (e) => {
    e.preventDefault()
    if (!nuevaTareaTexto.trim()) return

    fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: nuevaTareaTexto })
    })
      .then(() => {
        setNuevaTareaTexto('')
        cargarTareas()
      })
      .catch(err => console.error("Error al agregar:", err))
  }

  // AJUSTE: Usamos tarea._id en lugar de tarea.id
  const alternarEstadoTarea = (id, estadoActual) => {
    fetch(`http://localhost:3000/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hecha: !estadoActual })
    })
      .then(() => cargarTareas())
      .catch(err => console.error("Error al actualizar:", err))
  }

  // AJUSTE: Usamos tarea._id en lugar de tarea.id
  const eliminarTarea = (id) => {
    fetch(`http://localhost:3000/api/tareas/${id}`, {
      method: 'DELETE'
    })
      .then(() => cargarTareas())
      .catch(err => console.error("Error al eliminar:", err))
  }

  return (
    <div className="app-container">
      <header>
        <h1>🚀 Mi Gestor de Tareas (DB)</h1>
        <p>Conectado a MongoDB</p>
      </header>

      <main>
        {error && <div className="error-mensaje">{error}</div>}
        
        <form onSubmit={agregarTarea} className="formulario-tarea">
          <input 
            type="text" 
            placeholder="Nueva tarea..." 
            value={nuevaTareaTexto}
            onChange={(e) => setNuevaTareaTexto(e.target.value)}
          />
          <button type="submit">Agregar</button>
        </form>

        <div className="lista-tareas">
          {tareas.map(tarea => (
            // AJUSTE: Usamos tarea._id como key única
            <div key={tarea._id} className={`tarjeta-tarea ${tarea.hecha ? 'completada' : ''}`}>
              <div className="texto">
                <h3>{tarea.texto}</h3>
              </div>
              
              <div className="acciones">
                <button 
                  onClick={() => alternarEstadoTarea(tarea._id, tarea.hecha)} 
                  className="btn-estado"
                >
                  {tarea.hecha ? '↩️ Desmarcar' : '✅ Completar'}
                </button>
                
                <button 
                  onClick={() => eliminarTarea(tarea._id)} 
                  className="btn-eliminar"
                >
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App