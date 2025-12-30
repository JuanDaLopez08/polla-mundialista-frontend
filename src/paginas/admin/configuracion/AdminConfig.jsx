import React, { useState, useEffect } from 'react';
import { 
    Settings, Save, Clock, Calendar, 
    AlertCircle, CheckCircle, Lock, Unlock 
} from 'lucide-react';

// Librería de calendario
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es'; 

// Servicios
import { 
    obtenerConfiguraciones, 
    actualizarConfiguracion, 
    obtenerFases, 
    actualizarFase 
} from '../../../servicios/adminService';

import './AdminConfig.css';

// Registrar idioma español para el calendario
registerLocale('es', es);

const AdminConfig = () => {
    const [loading, setLoading] = useState(true);
    const [reglas, setReglas] = useState([]);
    const [fases, setFases] = useState([]);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [reglasData, fasesData] = await Promise.all([
                obtenerConfiguraciones(),
                obtenerFases()
            ]);
            setReglas(reglasData);
            setFases(fasesData);
        } catch (error) {
            console.error("Error cargando datos:", error);
            mostrarMensaje('error', 'Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const mostrarMensaje = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 3000);
    };

    // ==========================================
    // 1. LÓGICA DE REGLAS (PUNTOS)
    // ==========================================
    
    const handleReglaChange = (index, valorInput) => {
        if (valorInput === '' || /^\d+$/.test(valorInput)) {
            const nuevasReglas = [...reglas];
            nuevasReglas[index].valor = valorInput;
            setReglas(nuevasReglas);
        }
    };

    const guardarRegla = async (clave, valor) => {
        try {
            await actualizarConfiguracion(clave, valor);
            mostrarMensaje('success', `Regla ${formatClave(clave)} actualizada.`);
        } catch (error) {
            console.error(`Error guardando regla ${clave}:`, error);
            mostrarMensaje('error', 'No se pudo guardar la regla.');
        }
    };

    const formatClave = (texto) => {
        if (!texto) return '';
        return texto.replace('PUNTOS_', '').replace(/_/g, ' ');
    };

    // ==========================================
    // 2. LÓGICA DE FASES (CORREGIDA: SOLO LECTURA)
    // ==========================================

    const parseFecha = (fechaString) => {
        if (!fechaString) return new Date();

        // Limpieza básica de la fecha que viene del backend
        let fechaSoloDia = fechaString;
        if (typeof fechaString === 'string' && fechaString.includes('T')) {
            fechaSoloDia = fechaString.split('T')[0];
        }

        // Parseo seguro sin afectar zona horaria
        const [year, month, day] = fechaSoloDia.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleDateChange = (index, dateObject) => {
        if (!dateObject) return;

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const fechaString = `${year}-${month}-${day}`;

        const nuevasFases = [...fases];
        nuevasFases[index].fechaLimite = fechaString;
        setFases(nuevasFases);
    };

    const guardarFase = async (fase) => {
        try {
            let fechaBase = fase.fechaLimite;
            
            // Aseguramos que solo enviamos YYYY-MM-DD + Hora cierre
            if (fechaBase instanceof Date) {
                const year = fechaBase.getFullYear();
                const month = String(fechaBase.getMonth() + 1).padStart(2, '0');
                const day = String(fechaBase.getDate()).padStart(2, '0');
                fechaBase = `${year}-${month}-${day}`;
            } else if (typeof fechaBase === 'string' && fechaBase.includes('T')) {
                fechaBase = fechaBase.split('T')[0];
            }

            // Concatenamos 23:59:59 para guardar en BD
            const fechaFinalISO = `${fechaBase}T23:59:59`;

            await actualizarFase(fase.id, fechaFinalISO);
            mostrarMensaje('success', `Cierre de ${fase.nombre} actualizado.`);
        } catch (error) {
            console.error(`Error guardando fase ${fase.nombre}:`, error);
            mostrarMensaje('error', 'Error al actualizar fase.');
        }
    };

    if (loading) return <div className="admin-loader">Cargando Configuración...</div>;

    return (
        <div className="config-container">
            
            <div className="config-header">
                <div>
                    <h1 className="titulo-neon">CONFIGURACIÓN DEL SISTEMA</h1>
                    <p className="subtitle">Gestión de reglas de puntuación y cronograma</p>
                </div>
            </div>

            <div className="config-grid-layout">
                
                {/* --- PANEL IZQUIERDO: REGLAS --- */}
                <div className="config-card">
                    <div className="card-header">
                        <Settings className="card-icon" color="#bc13fe" />
                        <h2 style={{color: '#bc13fe'}}>REGLAS DE PUNTOS</h2>
                    </div>
                    <div className="card-body">
                        {reglas.map((regla, index) => (
                            <div key={regla.id} className="config-item">
                                <div className="label-group">
                                    <span className="config-label">{formatClave(regla.clave)}</span>
                                    <span className="config-key-mini">{regla.clave}</span>
                                </div>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        inputMode="numeric"
                                        className="neon-input"
                                        value={regla.valor}
                                        onChange={(e) => handleReglaChange(index, e.target.value)}
                                    />
                                    <button 
                                        className="btn-save-mini"
                                        onClick={() => guardarRegla(regla.clave, regla.valor)}
                                        title="Guardar cambio"
                                    >
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- PANEL DERECHO: FASES --- */}
                <div className="config-card">
                    <div className="card-header">
                        <Calendar className="card-icon" color="#00f2ff" />
                        <h2 style={{color: '#00f2ff'}}>CIERRES DE FASE</h2>
                    </div>
                    <div className="card-body">
                        {fases.map((fase, index) => {
                            // LÓGICA CORREGIDA:
                            // No calculamos nada. Confiamos ciegamente en lo que dice la BD.
                            const cerrada = fase.estado === 'CERRADA';
                            
                            return (
                                <div key={fase.id} className={`fase-item ${cerrada ? 'closed' : 'active'}`}>
                                    <div className="fase-top">
                                        <h3 className="fase-title">{fase.nombre}</h3>
                                        
                                        {/* Indicador visual basado solo en BD */}
                                        {cerrada ? (
                                            <span className="badge-closed"><Lock size={12}/> CERRADA</span>
                                        ) : (
                                            <span className="badge-open"><Unlock size={12}/> ABIERTA</span>
                                        )}
                                    </div>
                                    
                                    <div className="date-control">
                                        <label><Clock size={14}/> FECHA LÍMITE (CIERRA 23:59)</label>
                                        <div className="input-with-save">
                                            
                                            {/* DatePicker Controlado */}
                                            <div className="custom-datepicker-wrapper">
                                                <DatePicker 
                                                    selected={parseFecha(fase.fechaLimite)}
                                                    onChange={(date) => handleDateChange(index, date)}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="neon-input date-cyber-custom"
                                                    locale="es"
                                                    showPopperArrow={false}
                                                    shouldCloseOnSelect={true}
                                                />
                                            </div>

                                            <button 
                                                className="btn-save-fase"
                                                onClick={() => guardarFase(fase)}
                                                title="Guardar Fecha"
                                            >
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* TOAST DE NOTIFICACIÓN */}
            {mensaje && (
                <div className={`toast-notification ${mensaje.tipo === 'success' ? 'toast-exito' : 'toast-error'}`}>
                    {mensaje.tipo === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{mensaje.texto}</span>
                </div>
            )}

        </div>
    );
};

export default AdminConfig;