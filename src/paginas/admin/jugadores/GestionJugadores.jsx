import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, Filter, User, 
    Edit2, Save, X, CheckCircle // <--- Agregamos este icono
} from 'lucide-react';

// Importamos tus servicios
import { obtenerJugadores, crearJugador, actualizarJugador } from '../../../servicios/jugadores.servicio';
import { obtenerEquipos } from '../../../servicios/equipos.servicio';

import './GestionJugadores.css';

const GestionJugadores = () => {
    const [jugadores, setJugadores] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroEquipo, setFiltroEquipo] = useState('');

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    
    // Estado para la notificación de éxito
    const [showSuccess, setShowSuccess] = useState(false);

    // Formulario
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        equipoId: ''
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [listaJugadores, listaEquipos] = await Promise.all([
                obtenerJugadores(),
                obtenerEquipos()
            ]);
            setJugadores(listaJugadores);
            setEquipos(listaEquipos);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE FILTRADO ---
    const jugadoresFiltrados = jugadores.filter(jugador => {
        const coincideNombre = jugador.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const idEquipoJugador = jugador.equipo ? jugador.equipo.id : null;
        const coincideEquipo = filtroEquipo ? String(idEquipoJugador) === String(filtroEquipo) : true;
        return coincideNombre && coincideEquipo;
    });

    // --- MANEJO DEL MODAL ---
    const abrirModalCrear = () => {
        setModoEdicion(false);
        setFormData({ id: null, nombre: '', equipoId: '' });
        setModalOpen(true);
    };

    const abrirModalEditar = (jugador) => {
        setModoEdicion(true);
        setFormData({ 
            id: jugador.id, 
            nombre: jugador.nombre, 
            equipoId: jugador.equipo ? jugador.equipo.id : '' 
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            if (modoEdicion) {
                await actualizarJugador(formData.id, formData.nombre);
            } else {
                await crearJugador(formData.nombre, formData.equipoId);
            }
            
            await cargarDatos();
            cerrarModal();

            // --- MOSTRAR NOTIFICACIÓN ---
            setShowSuccess(true);
            // Ocultar automáticamente después de 3 segundos
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Error al guardar:", error);
            // Aquí podrías poner otra notificación de error si quisieras
        }
    };

    // Helper para previsualizar bandera en el Modal
    const obtenerEquipoSeleccionado = () => {
        if (!formData.equipoId) return null;
        return equipos.find(e => String(e.id) === String(formData.equipoId));
    };

    const equipoSeleccionadoPreview = obtenerEquipoSeleccionado();

    if (loading) return <div className="admin-loader">Cargando datos...</div>;

    return (
        <div className="players-container">
            
            {/* HEADER */}
            <div className="players-header">
                <div>
                    <h1 className="titulo-neon">JUGADORES</h1>
                    <p className="subtitle">Gestión de los candidatos a bota de oro</p>
                </div>
                <button className="btn-neon-primary" onClick={abrirModalCrear}>
                    <Plus size={20} /> NUEVO JUGADOR
                </button>
            </div>

            {/* BARRA DE HERRAMIENTAS */}
            <div className="toolbar">
                <div className="search-box">
                    <Search className="icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar jugador..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <Filter className="icon" size={18} />
                    <select 
                        value={filtroEquipo} 
                        onChange={(e) => setFiltroEquipo(e.target.value)}
                    >
                        <option value="">Todos los Países</option>
                        {equipos.map(eq => (
                            <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GRID DE JUGADORES */}
            <div className="players-grid">
                {jugadoresFiltrados.map(jugador => {
                    const equipo = jugador.equipo; 
                    const tieneEquipo = equipo && equipo.nombre;

                    return (
                        <div key={jugador.id} className="player-card">
                            <div className="card-top">
                                <div className="player-avatar">
                                    {tieneEquipo && equipo.urlEscudo ? (
                                        <img 
                                            src={equipo.urlEscudo} 
                                            alt={equipo.nombre} 
                                            className="avatar-img"
                                        />
                                    ) : (
                                        <User size={30} className="text-slate-400"/>
                                    )}
                                </div>
                                <button className="btn-icon-edit" onClick={() => abrirModalEditar(jugador)}>
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            
                            <div className="card-info">
                                <h3 className="player-name">{jugador.nombre}</h3>
                                <div className="player-country-name">
                                    {tieneEquipo ? equipo.nombre : "Sin País"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{modoEdicion ? 'EDITAR JUGADOR' : 'NUEVO JUGADOR'}</h2>
                            <button className="btn-close" onClick={cerrarModal}><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleGuardar}>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    placeholder="Ej. Lionel Messi"
                                />
                            </div>

                            {!modoEdicion && (
                                <div className="form-group">
                                    <label>Seleccionar País</label>
                                    
                                    {equipoSeleccionadoPreview && (
                                        <div className="country-preview-badge">
                                            <img src={equipoSeleccionadoPreview.urlEscudo} alt="Bandera" />
                                            <span>{equipoSeleccionadoPreview.nombre}</span>
                                        </div>
                                    )}

                                    <select 
                                        required 
                                        value={formData.equipoId}
                                        onChange={(e) => setFormData({...formData, equipoId: e.target.value})}
                                    >
                                        <option value="">-- Elegir País --</option>
                                        {equipos.map(eq => (
                                            <option key={eq.id} value={eq.id}>
                                                {eq.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {modoEdicion && (
                                <div className="warning-msg">
                                    ⚠️ Para cambiar el país, contacte al administrador.
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={cerrarModal}>CANCELAR</button>
                                <button type="submit" className="btn-save">
                                    <Save size={18} /> GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- COMPONENTE DE NOTIFICACIÓN DE ÉXITO --- */}
            {showSuccess && (
                <div className="toast-success">
                    <CheckCircle size={24} />
                    <span>¡Operación realizada con éxito!</span>
                </div>
            )}

        </div>
    );
};

export default GestionJugadores;