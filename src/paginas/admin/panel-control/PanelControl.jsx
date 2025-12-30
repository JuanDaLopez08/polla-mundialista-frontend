import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, Trophy, Calendar, Activity, 
    AlertCircle, Clock, CheckCircle, Settings, ArrowRight,
    Target, Award, Star, User, Swords 
} from 'lucide-react';

import clienteAxios from '../../../configuracion/clienteAxios';
import { obtenerPartidos } from '../../../servicios/partidos.servicio';
import { obtenerConfiguraciones } from '../../../servicios/adminService'; 

import './PanelControl.css';

const PanelControl = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // Estados
    const [kpis, setKpis] = useState({
        totalUsuarios: 0,
        partidosJugados: 0,
        totalPartidos: 0,
        faseActual: 'Cargando...'
    });
    const [listaConfiguracion, setListaConfiguracion] = useState([]);
    const [agenda, setAgenda] = useState([]);
    const [podio, setPodio] = useState([]);

    useEffect(() => {
        cargarDatosDashboard();
    }, []);

    const cargarDatosDashboard = async () => {
        try {
            setLoading(true);
            const [rankingRes, partidosData, configData] = await Promise.all([
                clienteAxios.get('/usuarios/ranking'),
                obtenerPartidos(),
                obtenerConfiguraciones()
            ]);

            const listaRanking = rankingRes.data || [];
            const listaPartidos = partidosData || [];
            const configs = Array.isArray(configData) ? configData : [];

            // 1. KPIS & PODIO
            const totalUsers = listaRanking.length;
            const rankingOrdenado = listaRanking.sort((a, b) => b.puntosTotales - a.puntosTotales);
            const top3 = rankingOrdenado.slice(0, 3);

            // 2. CONFIGURACIÓN
            setListaConfiguracion(configs);

            // 3. PARTIDOS
            const finalizados = listaPartidos.filter(p => p.estado === 'FINALIZADO').length;
            const totalP = listaPartidos.length;
            const pendientes = listaPartidos.filter(p => p.estado !== 'FINALIZADO');
            pendientes.sort((a, b) => new Date(a.fechaPartido) - new Date(b.fechaPartido));
            
            const proximos = pendientes.slice(0, 4);
            const faseActualNombre = proximos.length > 0 
                ? (proximos[0].fase?.nombre || 'Fase de Grupos') 
                : (totalP > 0 && finalizados === totalP ? 'Torneo Finalizado' : 'Por Definir');

            setKpis({
                totalUsuarios: totalUsers,
                partidosJugados: finalizados,
                totalPartidos: totalP,
                faseActual: faseActualNombre.replace(/_/g, ' ')
            });

            setAgenda(proximos);
            setPodio(top3);

        } catch (error) {
            console.error("Error cargando dashboard admin:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- HELPERS VISUALES ---
    const getEstadoAgenda = (fecha) => {
        if (!fecha) return { etiqueta: 'TBD', clase: 'futuro', icono: <Calendar size={14}/> };
        const ahora = new Date();
        const fechaObj = new Date(fecha);
        
        if (ahora > fechaObj) return { etiqueta: 'PENDIENTE', clase: 'urgente', icono: <AlertCircle size={14}/> };
        const diffHoras = (fechaObj - ahora) / 36e5;
        if (diffHoras < 24) return { etiqueta: 'HOY / MAÑANA', clase: 'proximo', icono: <Clock size={14}/> };
        return { etiqueta: 'PRÓXIMAMENTE', clase: 'futuro', icono: <Calendar size={14}/> };
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Por confirmar";
        return new Date(fecha).toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' 
        });
    };

    const formatearClave = (texto) => {
        if (!texto) return '';
        return texto.replace(/PUNTOS_/g, '').replace(/_/g, ' ');
    };

    const getClaseRegla = (clave) => {
        if (clave.includes('EXACTO')) return 'exacto';
        if (clave.includes('GANADOR')) return 'ganador';
        if (clave.includes('INVERTIDO')) return 'invertido';
        if (clave.includes('CLASIFICADO')) return 'clasificado';
        if (clave.includes('PALO')) return 'palo';
        if (clave.includes('GOLEADOR')) return 'goleador';
        if (clave.includes('CAMPEON')) return 'campeon';
        return '';
    };

    const getIconoRegla = (clave) => {
        if (clave.includes('EXACTO')) return <Target size={24} />;
        if (clave.includes('GANADOR')) return <Award size={24} />;
        if (clave.includes('INVERTIDO')) return <AlertCircle size={24} />;
        if (clave.includes('CLASIFICADO')) return <Star size={24} />;
        if (clave.includes('PALO')) return <Swords size={24} />;
        if (clave.includes('GOLEADOR')) return <User size={24} />;
        if (clave.includes('CAMPEON')) return <Trophy size={24} />;
        return <Settings size={24} />;
    };

    if (loading) return <div className="admin-loader">Cargando Panel...</div>;

    return (
        <div className="panel-container animate-fade-in">
            
            {/* HEADER */}
            <header className="panel-header">
                <div>
                    <h1 className="titulo-neon text-left">PANEL DE CONTROL</h1>
                    <p className="panel-subtitle">Visión general del torneo en tiempo real</p>
                </div>
                <div className="fase-badge">
                    <Activity size={18} />
                    <span>{kpis.faseActual}</span>
                </div>
            </header>

            {/* KPIS PRINCIPALES */}
            <div className="kpi-grid">
                <div className="kpi-card card-punto ganador">
                    <div className="kpi-icon"><Users size={32} /></div>
                    <div className="kpi-content">
                        <h3>USUARIOS</h3>
                        <p className="kpi-value">{kpis.totalUsuarios}</p>
                    </div>
                </div>

                <div className="kpi-card card-punto exacto">
                    <div className="kpi-icon"><Trophy size={32} /></div>
                    <div className="kpi-content">
                        <h3>PROGRESO</h3>
                        <div className="progress-bar-mini">
                            <div className="progress-fill" style={{width: `${kpis.totalPartidos > 0 ? (kpis.partidosJugados / kpis.totalPartidos) * 100 : 0}%`}}></div>
                        </div>
                        <span className="kpi-detail">{kpis.partidosJugados}/{kpis.totalPartidos} Partidos</span>
                    </div>
                </div>
            </div>

            {/* GRID CENTRAL */}
            <div className="main-grid">
                
                {/* AGENDA - DISEÑO TICKET */}
                <section className="panel-section agenda-section">
                    <div className="section-header">
                        <h2 className="section-title">PRÓXIMOS ENCUENTROS</h2>
                    </div>

                    <div className="agenda-list">
                        {agenda.length > 0 ? (
                            agenda.map(partido => {
                                const estado = getEstadoAgenda(partido.fechaPartido);
                                return (
                                    <div key={partido.id} className={`agenda-ticket ${estado.clase}`}>
                                        
                                        {/* CABECERA (Status - Fecha) */}
                                        <div className="ticket-header">
                                            <div className="ticket-status">
                                                {estado.icono} <span>{estado.etiqueta}</span>
                                            </div>
                                            
                                            <div className="ticket-date">
                                                {estado.etiqueta === 'PENDIENTE' ? (
                                                    <button className="btn-cargar-mini" onClick={() => navigate('/admin/gestion-partidos')}>
                                                        CARGAR
                                                    </button>
                                                ) : (
                                                    // Usamos la clase simple para el texto de fecha
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                                                        {formatearFecha(partido.fechaPartido)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* CUERPO (Equipos Centrados) */}
                                        <div className="ticket-body">
                                            {/* Usamos team-mini para que el CSS controle el tamaño de la imagen (35px) */}
                                            <div className="team-mini right">
                                                <span className="t-name">{partido.equipoLocal?.nombre || 'TBD'}</span>
                                                <img src={partido.equipoLocal?.urlEscudo} alt="L" onError={(e) => e.target.style.display='none'} />
                                            </div>
                                            
                                            <span className="vs">VS</span>
                                            
                                            <div className="team-mini left">
                                                <img src={partido.equipoVisitante?.urlEscudo} alt="V" onError={(e) => e.target.style.display='none'} />
                                                <span className="t-name">{partido.equipoVisitante?.nombre || 'TBD'}</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">
                                <CheckCircle size={40} color="#00f2ff" />
                                <p>Agenda al día</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* PODIO */}
                <section className="panel-section podio-section">
                    <div className="section-header">
                        <h2 className="section-title">LÍDERES</h2>
                        {/* Botón corregido */}
                        <button className="btn-link-neon" onClick={() => navigate('/ranking')}>
                            VER RANKING <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="podio-container">
                        {/* 2do */}
                        {podio[1] && (
                            <div className="podio-item silver animate-fade-in" style={{animationDelay: '0.1s'}}>
                                <div className="medalla">2</div>
                                <div className="avatar">{podio[1].username?.substring(0,2).toUpperCase()}</div>
                                <span className="p-name">{podio[1].username}</span>
                                <span className="p-points">{podio[1].puntosTotales} pts</span>
                                <div className="bar"></div>
                            </div>
                        )}
                        {/* 1er */}
                        {podio[0] && (
                            <div className="podio-item gold animate-fade-in">
                                <div className="crown">👑</div>
                                <div className="medalla">1</div>
                                <div className="avatar big">{podio[0].username?.substring(0,2).toUpperCase()}</div>
                                <span className="p-name">{podio[0].username}</span>
                                <span className="p-points">{podio[0].puntosTotales} pts</span>
                                <div className="bar"></div>
                            </div>
                        )}
                        {/* 3er */}
                        {podio[2] && (
                            <div className="podio-item bronze animate-fade-in" style={{animationDelay: '0.2s'}}>
                                <div className="medalla">3</div>
                                <div className="avatar">{podio[2].username?.substring(0,2).toUpperCase()}</div>
                                <span className="p-name">{podio[2].username}</span>
                                <span className="p-points">{podio[2].puntosTotales} pts</span>
                                <div className="bar"></div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* SECCIÓN 4: CONFIGURACIÓN */}
            <section className="panel-section config-section">
                <div className="section-header">
                    <h2 className="section-title">CONFIGURACIÓN DEL SISTEMA</h2>
                    <button className="btn-link-neon" onClick={() => navigate('/admin/configuracion')}>
                        <Settings size={14} /> EDITAR VALORES
                    </button>
                </div>
                
                <div className="config-grid">
                    {listaConfiguracion.map((item) => (
                        <div key={item.id || item.clave} className={`card-punto mini ${getClaseRegla(item.clave)}`}>
                            <div className="mini-icon">{getIconoRegla(item.clave)}</div>
                            <div className="mini-data">
                                <span className="mini-label">{formatearClave(item.clave)}</span>
                                <span className="mini-value">{item.valor} PTS</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PanelControl;