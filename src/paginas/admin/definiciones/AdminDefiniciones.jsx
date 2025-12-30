import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Medal, AlertTriangle, CheckCircle, Save, ChevronDown, Search, X } from 'lucide-react';

// --- IMPORTS DE SERVICIOS ---
import { obtenerEquipos } from '../../../servicios/equipos.servicio';
import { obtenerJugadores } from '../../../servicios/jugadores.servicio';
// Asegúrate de importar 'obtenerResultadosGuardados' que agregamos al final de adminService
import { 
    definirCampeonReal, 
    definirGoleadorReal, 
    obtenerResultadosGuardados 
} from '../../../servicios/adminService';

import './AdminDefiniciones.css';

const AdminDefiniciones = () => {
    // Estados de carga y datos maestros
    const [loading, setLoading] = useState(true);
    const [equipos, setEquipos] = useState([]);
    const [jugadores, setJugadores] = useState([]);

    // Estados de selección (Objetos completos)
    const [campeonSeleccionado, setCampeonSeleccionado] = useState(null);
    const [goleadorSeleccionado, setGoleadorSeleccionado] = useState(null);

    // Estados visuales (Resultados finales)
    const [campeonDefinido, setCampeonDefinido] = useState(false);
    const [goleadorDefinido, setGoleadorDefinido] = useState(false);

    // Notificaciones (Toast)
    const [mensaje, setMensaje] = useState(null);

    // --- ESTADO PARA EL MODAL CYBERPUNK ---
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '', // 'CAMPEON' o 'GOLEADOR'
        data: null, // El objeto seleccionado
    });

    // --- CARGA INICIAL DE DATOS (Con Persistencia) ---
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                
                // 1. Cargamos Listas y Resultados Guardados en paralelo
                const [dataEquipos, dataJugadores, dataResultados] = await Promise.all([
                    obtenerEquipos(),
                    obtenerJugadores(),
                    obtenerResultadosGuardados() // <--- Llamada al nuevo endpoint GET
                ]);
                
                setEquipos(dataEquipos);
                setJugadores(dataJugadores);

                // 2. Si ya existen resultados en la BD, actualizamos la pantalla
                if (dataResultados) {
                    // Verificar si ya hay Campeón
                    if (dataResultados.equipoCampeon) {
                        setCampeonSeleccionado(dataResultados.equipoCampeon);
                        setCampeonDefinido(true); // Bloquea la tarjeta y muestra el ganador
                    }
                    
                    // Verificar si ya hay Goleador
                    if (dataResultados.jugadorGoleador) {
                        setGoleadorSeleccionado(dataResultados.jugadorGoleador);
                        setGoleadorDefinido(true); // Bloquea la tarjeta y muestra el ganador
                    }
                }

            } catch (error) {
                console.error("Error cargando datos:", error);
                setMensaje({ tipo: 'error', texto: 'Error cargando datos del sistema.' });
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // --- MANEJADORES DEL MODAL ---

    const confirmarCampeon = () => {
        if (!campeonSeleccionado) return;
        setModalConfig({
            isOpen: true,
            type: 'CAMPEON',
            data: campeonSeleccionado
        });
    };

    const confirmarGoleador = () => {
        if (!goleadorSeleccionado) return;
        setModalConfig({
            isOpen: true,
            type: 'GOLEADOR',
            data: goleadorSeleccionado
        });
    };

    const cerrarModal = () => {
        setModalConfig({ isOpen: false, type: '', data: null });
    };

    // --- EJECUTAR LA ACCIÓN FINAL ---
    const ejecutarGuardado = async () => {
        const { type, data } = modalConfig;
        cerrarModal(); // Cerramos modal

        try {
            if (type === 'CAMPEON') {
                await definirCampeonReal(data.id);
                setCampeonDefinido(true);
                setMensaje({ tipo: 'success', texto: '¡Campeón registrado y puntos calculados!' });
            } else if (type === 'GOLEADOR') {
                await definirGoleadorReal(data.id);
                setGoleadorDefinido(true);
                setMensaje({ tipo: 'success', texto: '¡Goleador registrado y puntos calculados!' });
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            setMensaje({ tipo: 'error', texto: `Error al procesar el ${type.toLowerCase()}.` });
        }
    };

    // Helper para imágenes rotas
    const handleImageError = (e) => {
        e.target.src = "https://cdn-icons-png.flaticon.com/512/16/16480.png"; // Icono genérico
        e.target.style.opacity = "0.5";
    };

    if (loading) return <div className="p-10 text-center text-neon-cyan" style={{color: '#00f3ff'}}>Cargando Sistema...</div>;

    return (
        <div className="definiciones-container">
            
            {/* HEADER */}
            <div className="definiciones-header">
                <h1 className="titulo-neon">DEFINICIONES FINALES</h1>
                <p className="subtitle">Gestión de Resultados Oficiales y Cierre de Copa</p>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="definiciones-grid">
                
                {/* --- TARJETA CAMPEÓN --- */}
                <div className="def-card card-campeon">
                    {!campeonDefinido ? (
                        <>
                            <div className="card-top-icon">
                                <Trophy size={48} className="icon-glow-gold" />
                            </div>
                            <h2>DEFINIR CAMPEÓN</h2>
                            <p className="card-desc">
                                Selecciona la selección que ganó la final.
                            </p>
                            
                            <CustomSelect 
                                placeholder="Seleccionar País..."
                                options={equipos}
                                selected={campeonSeleccionado}
                                onSelect={setCampeonSeleccionado}
                                renderOption={(equipo) => (
                                    <>
                                        <img 
                                            src={equipo.urlEscudo} 
                                            alt={equipo.nombre} 
                                            className="escudo-small"
                                            onError={handleImageError}
                                        />
                                        <span>{equipo.nombre}</span>
                                    </>
                                )}
                                filterBy="nombre"
                            />

                            <button 
                                className="btn-neon btn-gold"
                                onClick={confirmarCampeon}
                                disabled={!campeonSeleccionado}
                            >
                                <Save size={18} /> CONFIRMAR CAMPEÓN
                            </button>
                        </>
                    ) : (
                        <div className="resultado-final">
                            <span className="etiqueta-ganadora">CAMPEÓN OFICIAL</span>
                            <img 
                                src={campeonSeleccionado.urlEscudo} 
                                alt="" 
                                className="escudo-gigante" 
                                onError={handleImageError}
                            />
                            <div className="nombre-ganador">{campeonSeleccionado.nombre}</div>
                            {/* Sin botón de corregir - Irreversible */}
                        </div>
                    )}
                </div>

                {/* --- TARJETA GOLEADOR --- */}
                <div className="def-card card-goleador">
                    {!goleadorDefinido ? (
                        <>
                            <div className="card-top-icon">
                                <Medal size={48} className="icon-glow-pink" />
                            </div>
                            <h2>DEFINIR GOLEADOR</h2>
                            <p className="card-desc">
                                Busca al jugador con más goles en el torneo.
                            </p>

                            <CustomSelect 
                                placeholder="Buscar Jugador..."
                                options={jugadores}
                                selected={goleadorSeleccionado}
                                onSelect={setGoleadorSeleccionado}
                                renderOption={(jugador) => (
                                    <>
                                        {/* Acceso seguro al objeto equipo anidado */}
                                        {jugador.equipo?.urlEscudo ? (
                                            <img 
                                                src={jugador.equipo.urlEscudo} 
                                                alt="Pais" 
                                                className="escudo-small"
                                                onError={handleImageError} 
                                            />
                                        ) : (
                                            <div className="escudo-small bg-gray-600 rounded-full"></div>
                                        )}
                                        <span>{jugador.nombre}</span>
                                    </>
                                )}
                                filterBy="nombre"
                                hasSearch={true}
                            />

                            <button 
                                className="btn-neon btn-pink"
                                onClick={confirmarGoleador}
                                disabled={!goleadorSeleccionado}
                            >
                                <Save size={18} /> CONFIRMAR GOLEADOR
                            </button>
                        </>
                    ) : (
                        <div className="resultado-final">
                            <span className="etiqueta-ganadora" style={{background: 'var(--neon-pink)', color: 'white'}}>
                                GOLEADOR OFICIAL
                            </span>
                            <img 
                                src={goleadorSeleccionado.equipo?.urlEscudo} 
                                alt="" 
                                className="escudo-gigante" 
                                onError={handleImageError} 
                            />
                            <div className="nombre-ganador">{goleadorSeleccionado.nombre}</div>
                            {/* Sin botón de corregir - Irreversible */}
                        </div>
                    )}
                </div>

            </div>

            {/* --- ZONA DE ADVERTENCIA ESTÁTICA --- */}
            <div className="warning-zone">
                <AlertTriangle size={40} className="warning-icon" />
                <div className="warning-text">
                    <h3>Zona de Peligro: Acción Irreversible</h3>
                    <p>
                        Al confirmar resultados, el sistema <strong>calculará automáticamente los puntos</strong>. 
                        Asegúrate de tener el dato oficial.
                    </p>
                </div>
            </div>

            {/* --- MODAL CYBERPUNK DE CONFIRMACIÓN --- */}
            {modalConfig.isOpen && (
                <div className="cyber-modal-overlay">
                    <div className="cyber-modal-content">
                        <div className="modal-icon-wrapper">
                            <AlertTriangle size={60} color="#00f3ff" style={{filter: 'drop-shadow(0 0 10px #00f3ff)'}} />
                        </div>
                        <h3>CONFIRMAR {modalConfig.type}</h3>
                        <p>
                            ¿Estás seguro de establecer a: <br/>
                            <span className="highlight-text" style={{fontSize: '1.4rem', display: 'block', margin: '15px 0'}}>
                                {modalConfig.data?.nombre}
                            </span>
                             como el {modalConfig.type === 'CAMPEON' ? 'Campeón' : 'Goleador'} oficial?
                        </p>
                        <p style={{fontSize: '0.9rem', color: '#ff4444', borderTop: '1px solid #333', paddingTop: '10px'}}>
                            ⚠️ Esta acción calculará los puntos de todos los usuarios y es totalmente irreversible.
                        </p>
                        
                        <div className="modal-actions">
                            <button className="btn-modal btn-cancel" onClick={cerrarModal}>
                                Cancelar
                            </button>
                            <button className="btn-modal btn-confirm" onClick={ejecutarGuardado}>
                                Confirmar y Procesar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST DE MENSAJES */}
            {mensaje && (
                <div className={`fixed bottom-5 right-5 p-4 rounded-lg flex items-center gap-2 ${mensaje.tipo === 'success' ? 'bg-green-600' : 'bg-red-600'}`} style={{zIndex: 30000, color: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.5)'}}>
                    {mensaje.tipo === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-bold">{mensaje.texto}</span>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE AUXILIAR: SELECT PERSONALIZADO ---
const CustomSelect = ({ options, selected, onSelect, placeholder, renderOption, filterBy, hasSearch = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Cerrar al hacer click afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Filtrado
    const filteredOptions = options.filter(opt => 
        opt[filterBy] && opt[filterBy].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="custom-select-wrapper" ref={wrapperRef}>
            <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
                {selected ? (
                    <div className="selected-value">
                        {renderOption(selected)}
                    </div>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <ul className="options-list">
                    {hasSearch && (
                        <div className="p-2 sticky top-0 bg-[#0a0a0a] border-b border-gray-700 z-10">
                            <div className="flex items-center gap-2 bg-[#1a1a1a] px-2 rounded border border-gray-700">
                                <Search size={14} className="text-gray-400"/>
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Buscar..." 
                                    autoFocus
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li 
                                key={opt.id} 
                                className="option-item" 
                                onClick={() => {
                                    onSelect(opt);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                {renderOption(opt)}
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 text-center">No encontrado</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AdminDefiniciones;