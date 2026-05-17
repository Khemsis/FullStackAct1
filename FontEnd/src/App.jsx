// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [error, setError] = useState(null)
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('') // Estado para el input de texto

  // Función para cargar las tareas (GET)
  const cargarTareas = () => {
    fetch('http://localhost:3000/api/tareas')
      .then(response => {
        if (!response.ok) throw new Error('No se pudo conectar con el servidor')
        return response.json()
      })
      .then(data => {
        setTareas(data)
        setError(null)
      })
      .catch(err => {
        console.error(err)
        setError('¡Error! Asegúrate de que tu Backend (terminal negra) esté corriendo.')
      })
  }

  useEffect(() => {
    cargarTareas()
  }, [])

  // Función para AGREGAR una tarea (POST)
  const agregarTarea = (e) => {
    e.preventDefault() // Evita que la página se recargue
    if (!nuevaTareaTexto.trim()) return // No agregar si está vacío

    fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: nuevaTareaTexto })
    })
      .then(response => response.json())
      .then(() => {
        setNuevaTareaTexto('') // Limpiamos el input
        cargarTareas() // Recargamos la lista actualizada
      })
      .catch(err => console.error("Error al agregar:", err))
  }

  // Función para MARCAR COMO COMPLETADA o PENDIENTE (PUT)
  const alternarEstadoTarea = (id, estadoActual) => {
    fetch(`http://localhost:3000/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hecha: !estadoActual }) // Mandamos el estado invertido
    })
      .then(() => cargarTareas())
      .catch(err => console.error("Error al actualizar:", err))
  }

  // Función para ELIMINAR una tarea (DELETE)
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
        <h1> Gestor de Tareas </h1>
        <p>Proyecto Full Stack - Actividad 1</p>
      </header>

      <main>
        {error && <div className="error-mensaje">{error}</div>}
        
        {/* FORMULARIO PARA AGREGAR NUEVA TAREA */}
        {!error && (
          <form onSubmit={agregarTarea} className="formulario-tarea">
            <input 
              type="text" 
              placeholder="Escribe una nueva tarea..." 
              value={nuevaTareaTexto}
              onChange={(e) => setNuevaTareaTexto(e.target.value)}
            />
            <button type="submit">Agregar</button>
          </form>
        )}

        <div className="lista-tareas">
          {tareas.length === 0 && !error ? <p>No hay tareas pendientes. ¡Buen trabajo!</p> : null}
          
          {tareas.map(tarea => (
            <div key={tarea.id} className={`tarjeta-tarea ${tarea.hecha ? 'completada' : ''}`}>
              <div className="texto">
                <h3>{tarea.texto}</h3>
                <span className="badge">{tarea.hecha ? 'Completada' : 'Pendiente'}</span>
              </div>
              
              {/* SECCIÓN DE BOTONES DE ACCIÓN */}
              <div className="acciones">
                <button 
                  onClick={() => alternarEstadoTarea(tarea.id, tarea.hecha)} 
                  className="btn-estado"
                  title={tarea.hecha ? "Marcar como pendiente" : "Marcar como completada"}
                >
                  {tarea.hecha ? '↩️ Desmarcar' : '✅ Completar'}
                </button>
                
                <button 
                  onClick={() => eliminarTarea(tarea.id)} 
                  className="btn-eliminar"
                  title="Eliminar tarea"
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