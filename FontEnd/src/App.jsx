// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Aquí llamamos a tu servidor (la cocina)
    fetch('http://localhost:3000/api/tareas')
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor')
        }
        return response.json()
      })
      .then(data => setTareas(data))
      .catch(err => {
        console.error(err)
        setError('¡Error! Asegúrate de que tu Backend (terminal negra) esté corriendo.')
      })
  }, [])

  return (
    <div className="app-container">
      <header>
        <h1>🚀 Mi Gestor de Tareas</h1>
        <p>Proyecto Full Stack - Actividad 1</p>
      </header>

      <main>
        {error && <div className="error-mensaje">{error}</div>}
        
        <div className="lista-tareas">
          {tareas.length === 0 && !error ? <p>Cargando tareas...</p> : null}
          
          {tareas.map(tarea => (
            <div key={tarea.id} className={`tarjeta-tarea ${tarea.hecha ? 'completada' : ''}`}>
              <div className="texto">
                <h3>{tarea.texto}</h3>
                <span className="badge">{tarea.hecha ? 'Completada' : 'Pendiente'}</span>
              </div>
              <div className="icono">
                {tarea.hecha ? '✅' : '⏳'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App