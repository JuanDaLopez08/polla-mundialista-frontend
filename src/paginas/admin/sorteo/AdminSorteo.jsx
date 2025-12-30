import React, { useState, useEffect } from 'react';
import { 
    Shuffle, AlertTriangle, CheckCircle, 
    Users, Trophy, RefreshCw
} from 'lucide-react';

// Importaciones
import clienteAxios from '../../../configuracion/clienteAxios'; 
import { sortearPalos } from '../../../servicios/adminService'; 
import { obtenerMisEspeciales } from '../../../servicios/prediccionesService'; 

import './AdminSorteo.css';

const AdminSorteo = () => {
    const [loading, setLoading] = useState(true); 
    const [loadingText, setLoadingText] = useState('VERIFICANDO ESTADO DEL SORTEO...');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    
    // Estado de la vista (Falso = Botón Sorteo, Verdadero = Lista Resultados)
    const [sorteoRealizado, setSorteoRealizado] = useState(false);
    
    // Datos
    const [resultadosAsignacion, setResultadosAsignacion] = useState([]);
    const [totalParticipantes, setTotalParticipantes] = useState(0);
    const [usuariosSinEquipo, setUsuariosSinEquipo] = useState(0);

    // --- 1. EFECTO INICIAL: CARGAR Y VERIFICAR ---
    useEffect(() => {
        verificarEstadoSorteo();
    }, []);

    // Esta función carga los datos y decide qué pantalla mostrar
    const verificarEstadoSorteo = async () => {
        try {
            setLoading(true);
            
            // A. Traemos todos los usuarios (Ranking)
            const { data: listaUsuarios } = await clienteAxios.get('/usuarios/ranking');
            setTotalParticipantes(listaUsuarios.length);

            if (!listaUsuarios || listaUsuarios.length === 0) {
                setLoading(false);
                return;
            }

            // B. Consultamos en paralelo los especiales de cada usuario
            const promesasDeConsulta = listaUsuarios.map(async (usuario) => {
                try {
                    const datosEspeciales = await obtenerMisEspeciales(usuario.id);
                    return {
                        usuario: usuario,
                        equipoPalo: datosEspeciales?.equipoPalo || null 
                    };
                } catch (err) {
                    console.warn(`No se pudo obtener datos para usuario ${usuario.id}:`, err);
                    return { usuario: usuario, equipoPalo: null };
                }
            });

            const resultados = await Promise.all(promesasDeConsulta);
            
            // C. LÓGICA CORREGIDA: 
            // Contamos cuántos faltan por equipo
            const sinEquipoCount = resultados.filter(r => r.equipoPalo === null).length;
            setUsuariosSinEquipo(sinEquipoCount);

            // El sorteo se considera "Realizado" SOLO si TODOS tienen equipo.
            // Si hay nuevos (sinEquipoCount > 0), mostramos el botón de nuevo.
            const todosTienenEquipo = resultados.length > 0 && sinEquipoCount === 0;

            setResultadosAsignacion(resultados);
            setSorteoRealizado(todosTienenEquipo);

        } catch (error) {
            console.error("Error verificando estado del sorteo:", error);
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    const handleSorteoClick = () => {
        setConfirmModalOpen(true);
    };

    const confirmarSorteo = async () => {
        setConfirmModalOpen(false);
        setLoading(true);
        setLoadingText('ASIGNANDO EQUIPOS...');

        try {
            // 1. Ejecutar Sorteo en Backend
            await sortearPalos();
            
            // 2. Recargar datos para verificar si ya todos tienen equipo
            setLoadingText('ACTUALIZANDO LISTA...');
            
            setTimeout(async () => {
                await verificarEstadoSorteo();
            }, 1500);

        } catch (error) {
            console.error("Error CRÍTICO en el proceso de sorteo:", error);
            alert("Hubo un error al realizar el sorteo.");
            setLoading(false);
        }
    };

    // Render de carga inicial
    if (loading && !resultadosAsignacion.length && !sorteoRealizado) {
        return (
            <div className="sorteo-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div className="loading-text">{loadingText || 'CARGANDO...'}</div>
            </div>
        );
    }

    return (
        <div className="sorteo-container">
            
            <div className="sorteo-header">
                <div>
                    <h1 className="titulo-neon">SORTEO DE PALOS</h1>
                    <p className="subtitle">Asignación automática de equipos sorpresa</p>
                </div>
                <div className="stats-badge">
                    <Users size={20} color="#00f2ff"/>
                    <span>{totalParticipantes} PARTICIPANTES</span>
                </div>
            </div>

            {/* ZONA PRINCIPAL */}
            <div className="main-action-area">
                
                {!sorteoRealizado ? (
                    /* --- ESTADO 1: FALTAN EQUIPOS POR ASIGNAR --- */
                    <div className="sorteo-initial animate-fade-in">
                        
                        {/* Mensaje dinámico según si es el inicio o una actualización */}
                        <div className="instruction-card">
                            <AlertTriangle className="icon-warning" size={32} />
                            <div>
                                {usuariosSinEquipo > 0 && usuariosSinEquipo < totalParticipantes ? (
                                    <p>
                                        Se han detectado <strong>{usuariosSinEquipo} nuevos usuarios</strong> sin equipo asignado. 
                                        Ejecuta el sorteo para completar la asignación.
                                    </p>
                                ) : (
                                    <p>
                                        Al presionar el botón, el sistema asignará aleatoriamente 
                                        un <strong>Equipo Palo</strong> a cada usuario inscrito.
                                    </p>
                                )}
                            </div>
                        </div>

                        <button 
                            className="btn-big-neon"
                            onClick={handleSorteoClick}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-text">{loadingText}</span>
                            ) : (
                                <>
                                    <Shuffle size={32} />
                                    <span>
                                        {usuariosSinEquipo > 0 && usuariosSinEquipo < totalParticipantes 
                                            ? 'COMPLETAR SORTEO' 
                                            : 'REALIZAR SORTEO'}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    /* --- ESTADO 2: TODOS TIENEN EQUIPO (RESULTADOS) --- */
                    <div className="sorteo-results animate-fade-in">
                        <div className="success-banner">
                            <CheckCircle size={32} color="#10b981" />
                            <h2>ASIGNACIÓN COMPLETA</h2>
                        </div>
                        
                        <div className="results-grid">
                            {resultadosAsignacion.map((item, index) => (
                                <div key={index} className="match-pair-card">
                                    {/* LADO USUARIO */}
                                    <div className="side user-side">
                                        <div className="avatar-placeholder">
                                            {item.usuario.username ? item.usuario.username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="u-name">{item.usuario.username || 'Usuario'}</span>
                                    </div>

                                    {/* CONECTOR */}
                                    <div className="connector">
                                        <div className="line"></div>
                                        <div className="dot"></div>
                                    </div>

                                    {/* LADO EQUIPO */}
                                    <div className="side team-side">
                                        {item.equipoPalo ? (
                                            <>
                                                <img 
                                                    src={item.equipoPalo.urlEscudo} 
                                                    alt="Escudo" 
                                                    className="team-shield-mini" 
                                                />
                                                <span className="t-name-sorteo">{item.equipoPalo.nombre}</span>
                                            </>
                                        ) : (
                                            <span className="no-team">Sin Asignar</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="actions-footer">
                            <button className="btn-secondary" onClick={() => verificarEstadoSorteo()}>
                                <RefreshCw size={16} style={{marginRight: '8px'}}/> REFRESCAR DATOS
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <div className="modal-header-center">
                            <AlertTriangle size={48} color="#f59e0b" />
                            <h2>¿ESTÁS SEGURO?</h2>
                        </div>
                        <p className="confirm-text">
                            {usuariosSinEquipo > 0 && usuariosSinEquipo < totalParticipantes 
                                ? `Se asignarán equipos a los ${usuariosSinEquipo} usuarios nuevos.`
                                : `Se asignarán equipos aleatoriamente a ${totalParticipantes} usuarios.`
                            }
                            <br/>¿Deseas continuar?
                        </p>
                        <div className="modal-actions-center">
                            <button 
                                className="btn-cancel" 
                                onClick={() => setConfirmModalOpen(false)}
                            >
                                CANCELAR
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={confirmarSorteo}
                            >
                                SÍ, SORTEAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSorteo;