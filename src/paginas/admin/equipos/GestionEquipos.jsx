import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, Shield, 
    Flame, Edit2, Save, X, CheckCircle 
} from 'lucide-react';

// Asegúrate de importar 'actualizarEquipo' desde tu servicio
import { obtenerEquipos, actualizarEquipo } from '../../../servicios/equipos.servicio'; 

import './GestionEquipos.css';

const GestionEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroGrupo, setFiltroGrupo] = useState('');

    // --- ESTADOS PARA MODAL Y EDICIÓN ---
    const [modalOpen, setModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // Para el Toast
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        urlEscudo: '',
        esCandidatoPalo: false,
        grupoNombre: '' // Solo visual
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await obtenerEquipos();
            setEquipos(data);
        } catch (error) {
            console.error("Error cargando equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DEL MODAL ---
    const abrirModalEditar = (equipo) => {
        setFormData({
            id: equipo.id,
            nombre: equipo.nombre,
            urlEscudo: equipo.urlEscudo,
            esCandidatoPalo: equipo.esCandidatoPalo, // Esto viene del backend
            grupoNombre: equipo.grupo.nombre
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
    };

    // --- GUARDAR CAMBIOS ---
    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            // Objeto que espera tu Backend (EquipoDTO)
            const datosAEnviar = {
                nombre: formData.nombre,
                urlEscudo: formData.urlEscudo,
                esCandidatoPalo: formData.esCandidatoPalo
            };

            await actualizarEquipo(formData.id, datosAEnviar);
            
            // Recargar datos y cerrar
            await cargarDatos();
            cerrarModal();

            // Mostrar notificación de éxito
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error) {
            console.error("Error al actualizar equipo:", error);
            alert("Error al guardar. Revisa la consola.");
        }
    };

    // Extraer grupos únicos para el filtro
    const gruposUnicos = [...new Set(equipos.map(e => e.grupo.nombre))].sort();

    // Lógica de Filtrado
    const equiposFiltrados = equipos.filter(equipo => {
        const coincideNombre = equipo.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideGrupo = filtroGrupo ? equipo.grupo.nombre === filtroGrupo : true;
        return coincideNombre && coincideGrupo;
    });

    if (loading) return <div className="admin-loader">Cargando Equipos...</div>;

    return (
        <div className="teams-container">
            
            {/* HEADER */}
            <div className="teams-header">
                <div>
                    <h1 className="titulo-neon">SELECCIONES</h1>
                    <p className="subtitle">Gestión de selecciones y palos</p>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-box">
                    <Search className="icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar selección..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <Filter className="icon" size={18} />
                    <select 
                        value={filtroGrupo} 
                        onChange={(e) => setFiltroGrupo(e.target.value)}
                    >
                        <option value="">Todos los Grupos</option>
                        {gruposUnicos.map(grupo => (
                            <option key={grupo} value={grupo}>Grupo {grupo}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GRID DE EQUIPOS */}
            <div className="teams-grid">
                {equiposFiltrados.map(equipo => (
                    <div key={equipo.id} className={`team-card ${equipo.esCandidatoPalo ? 'is-palo' : ''}`}>
                        
                        {/* Indicador de "Palo" */}
                        {equipo.esCandidatoPalo && (
                            <div className="badge-palo" title="Candidato a Palo">
                                <Flame size={14} fill="#f59e0b" stroke="none" />
                            </div>
                        )}

                        <div className="card-top">
                            <div className="team-shield-container">
                                <img 
                                    src={equipo.urlEscudo} 
                                    alt={equipo.nombre} 
                                    className="shield-img"
                                />
                            </div>
                            {/* BOTÓN EDITAR CONECTADO */}
                            <button 
                                className="btn-icon-edit" 
                                onClick={() => abrirModalEditar(equipo)}
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                        
                        <div className="card-info">
                            <h3 className="team-name">{equipo.nombre}</h3>
                            <div className="team-meta">
                                <span className="iso-code">{equipo.codigoIso}</span>
                                <span className="group-badge">GRUPO {equipo.grupo.nombre}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>EDITAR EQUIPO</h2>
                            <button className="btn-close" onClick={cerrarModal}><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleGuardar}>
                            {/* GRUPO (SOLO LECTURA) */}
                            <div className="grupo-info-badge">
                                <span>PERTENECE al GRUPO {formData.grupoNombre}</span>
                            </div>

                            <div className="form-group">
                                <label>Nombre del País</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>URL del Escudo</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.urlEscudo}
                                    onChange={(e) => setFormData({...formData, urlEscudo: e.target.value})}
                                />
                                {/* Preview Pequeño */}
                                {formData.urlEscudo && (
                                    <div className="country-preview-badge" style={{marginTop: '10px'}}>
                                        <img src={formData.urlEscudo} alt="Preview" />
                                        <span>Vista Previa</span>
                                    </div>
                                )}
                            </div>

                            {/* CHECKBOX DE "PALO" */}
                            <div className="form-group-checkbox">
                                <label className="checkbox-container">
                                    <input 
                                        type="checkbox"
                                        checked={formData.esCandidatoPalo}
                                        onChange={(e) => setFormData({...formData, esCandidatoPalo: e.target.checked})}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="label-text">
                                        ¿Posible Palo? <Flame size={16} className="text-orange-500 inline"/>
                                    </span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={cerrarModal}>CANCELAR</button>
                                <button type="submit" className="btn-save">
                                    <Save size={18} /> GUARDAR CAMBIOS
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- NOTIFICACIÓN TOAST --- */}
            {showSuccess && (
                <div className="toast-success">
                    <CheckCircle size={24} />
                    <span>¡Equipo actualizado correctamente!</span>
                </div>
            )}

        </div>
    );
};

export default GestionEquipos;