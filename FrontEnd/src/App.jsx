import { useState, useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)

  const [nuevaTarea, setNuevaTarea] = useState('')
  const [urgencia, setUrgencia] = useState('Media')
  const [usuarioAsignado, setUsuarioAsignado] = useState('')

  const [nuevoUsuarioNombre, setNuevoUsuarioNombre] = useState('')
  const [nuevoUsuarioRol, setNuevoUsuarioRol] = useState('Desarrollador')

  const cargarDatos = () => {
    fetch('http://localhost:8082/api/tareas')
      .then(res => res.json())
      .then(data => setTareas(data))
      .catch(() => setError('¡Error! Asegúrate de que tus Microservicios estén corriendo.'))

    fetch('http://localhost:8081/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error al cargar usuarios:", err))
  }

  useEffect(() => {
    // Cargar los datos normales al inicio
    cargarDatos()

    // --- CONFIGURACIÓN DEL WEBSOCKET ---
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws-tareas'),
      onConnect: () => {
        console.log("🔌 ¡Conectado al WebSocket en tiempo real!")
        // Nos suscribimos al canal donde Java manda los avisos
        stompClient.subscribe('/topic/tareas', () => {
          console.log("🔔 ¡Aviso recibido! Recargando datos automáticamente...")
          cargarDatos() // Si alguien actualiza algo, recargamos la lista en silencio
        })
      },
      onStompError: (frame) => {
        console.error('Error de Broker: ' + frame.headers['message'])
      }
    })

    stompClient.activate()

    // Limpiar la conexión si cerramos la página
    return () => stompClient.deactivate()
  }, [])

  // (El resto de las funciones se mantienen exactamente igual)
  const crearUsuario = (e) => {
    e.preventDefault()
    if (!nuevoUsuarioNombre.trim()) return

    fetch('http://localhost:8081/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoUsuarioNombre, rol: nuevoUsuarioRol })
    })
    .then(() => {
      setNuevoUsuarioNombre('')
      cargarDatos() 
    })
  }

  const crearTarea = (e) => {
    e.preventDefault()
    if (!nuevaTarea.trim()) return

    fetch('http://localhost:8082/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: nuevaTarea,
        hecha: false,
        urgencia: urgencia,
        idUsuario: usuarioAsignado 
      })
    })
    .then(() => {
      setNuevaTarea('')
      setUrgencia('Media')
      setUsuarioAsignado('')
      // Ya no llamamos a cargarDatos() aquí, ¡el WebSocket lo hará por nosotros!
    })
  }

  const eliminarTarea = (id) => {
    fetch(`http://localhost:8082/api/tareas/${id}`, { method: 'DELETE' })
    // Ya no llamamos a cargarDatos() aquí tampoco
  }

  const colorUrgencia = (nivel) => {
    if (nivel === 'Alta') return '#e74c3c'
    if (nivel === 'Media') return '#f39c12'
    return '#2ecc71'
  }

  const obtenerNombreUsuario = (id) => {
    const user = usuarios.find(u => u.id === id)
    return user ? user.nombre : 'Sin asignar'
  }

  return (
    <div className="app-container" style={{ maxWidth: '700px' }}>
      <header>
        <h1>🚀 Mi Gestor de Proyectos</h1>
        <p>Microservicios + WebSockets (Tiempo Real)</p>
      </header>

      <main>
        {error && <div className="error-mensaje">{error}</div>}

        <section style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
          <h2 style={{marginTop: 0}}>👥 Equipo</h2>
          <form onSubmit={crearUsuario} style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
            <input 
              type="text" 
              value={nuevoUsuarioNombre} 
              onChange={(e) => setNuevoUsuarioNombre(e.target.value)} 
              placeholder="Nombre del miembro"
              style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #555', background: '#1a1a1a', color: 'white'}}
            />
            <select 
              value={nuevoUsuarioRol} 
              onChange={(e) => setNuevoUsuarioRol(e.target.value)}
              style={{padding: '10px', borderRadius: '8px', border: '1px solid #555', background: '#1a1a1a', color: 'white'}}
            >
              <option value="Desarrollador">Desarrollador</option>
              <option value="Diseñador">Diseñador</option>
              <option value="Líder de Proyecto">Líder de Proyecto</option>
            </select>
            <button type="submit" style={{backgroundColor: '#2ecc71', color: 'white', padding: '10px 20px'}}>
              Añadir
            </button>
          </form>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {usuarios.length === 0 ? <span style={{color: '#aaa', fontSize: '0.9rem'}}>Aún no hay miembros.</span> : null}
            {usuarios.map(user => (
              <span key={user.id} className="badge" style={{ fontSize: '0.9rem', padding: '8px', backgroundColor: '#34495e' }}>
                {user.nombre} ({user.rol})
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2>📋 Tareas</h2>
          <form onSubmit={crearTarea} style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
            <input 
              type="text" 
              value={nuevaTarea} 
              onChange={(e) => setNuevaTarea(e.target.value)} 
              placeholder="¿Qué hay que hacer?"
              style={{flex: '1 1 100%', padding: '10px', borderRadius: '8px', border: '1px solid #555', background: '#1a1a1a', color: 'white'}}
            />
            
            <select 
              value={urgencia} 
              onChange={(e) => setUrgencia(e.target.value)}
              style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #555', background: '#1a1a1a', color: 'white'}}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            <select 
              value={usuarioAsignado} 
              onChange={(e) => setUsuarioAsignado(e.target.value)}
              style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #555', background: '#1a1a1a', color: 'white'}}
            >
              <option value="">Sin asignar</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>

            <button type="submit" style={{backgroundColor: '#646cff', color: 'white', padding: '10px 20px', flex: 1}}>
              Agregar Tarea
            </button>
          </form>
          
          <div className="lista-tareas">
            {tareas.length === 0 && !error ? <p>No hay tareas. ¡Agrega una!</p> : null}
            
            {tareas.map(tarea => (
              <div key={tarea.id} className={`tarjeta-tarea ${tarea.hecha ? 'completada' : ''}`}>
                <div className="texto">
                  <h3 style={{margin: '0 0 5px 0'}}>{tarea.texto}</h3>
                  <span className="badge" style={{backgroundColor: colorUrgencia(tarea.urgencia), color: 'white'}}>
                    {tarea.urgencia}
                  </span>
                  <span className="badge" style={{marginLeft: '5px', backgroundColor: '#34495e', color: 'white'}}>
                    👤 {obtenerNombreUsuario(tarea.idUsuario)}
                  </span>
                </div>
                <div className="acciones" style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <button 
                    onClick={() => eliminarTarea(tarea.id)}
                    style={{backgroundColor: '#c0392b', padding: '5px 10px', fontSize: '0.9rem'}}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default App