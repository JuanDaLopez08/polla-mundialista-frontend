import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Layers, Users, Shield, ChevronDown, X } from 'lucide-react';
import clienteAxios from '../../../configuracion/clienteAxios';

// --- COMPONENTE PERSONALIZADO: NEON SELECT ---
// Este componente reemplaza al <select> nativo para poder darle estilo al menú desplegable
const NeonSelect = ({ icon: Icon, label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar si clicamos fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="neon-select-container" ref={dropdownRef}>
      {/* Botón Principal (Lo que se ve antes de abrir) */}
      <div 
        className={`neon-select-trigger ${isOpen ? 'active' : ''} ${value ? 'has-value' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-content">
          {Icon && <Icon size={16} className="trigger-icon" />}
          <span className="trigger-text">
            {value || label} {/* Muestra el valor seleccionado o el placeholder */}
          </span>
        </div>
        
        <div className="trigger-actions">
           {value && (
             <span 
               className="clear-icon" 
               onClick={(e) => {
                 e.stopPropagation();
                 onChange(""); // Limpiar valor
               }}
             >
               <X size={14} />
             </span>
           )}
           <ChevronDown size={16} className={`arrow-icon ${isOpen ? 'rotate' : ''}`} />
        </div>
      </div>

      {/* Menú Desplegable (Solo visible si isOpen es true) */}
      {isOpen && (
        <div className="neon-dropdown-menu animate-fade-in-fast">
          <div 
            className={`neon-option ${value === "" ? 'selected' : ''}`} 
            onClick={() => { onChange(""); setIsOpen(false); }}
          >
            {label} (Ver Todos)
          </div>
          {options.map((opt) => (
            <div 
              key={opt} 
              className={`neon-option ${value === opt ? 'selected' : ''}`} 
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const FixtureGeneral = () => {
  const [partidos, setPartidos] = useState([]);
  
  // Estados de Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroFase, setFiltroFase] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');

  const [listas, setListas] = useState({ fechas: [], fases: [], grupos: [], equipos: [] });

  // Helper: Formatear fecha bonito (Ej: "13 de Junio de 2026")
  const formatearFechaBonita = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    // Truco para corregir la zona horaria si sale un día antes (depende del backend)
    // fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()); 
    
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const texto = fecha.toLocaleDateString('es-ES', opciones);
    
    // Convertir primera letra a mayúscula (Javascript lo da en minúscula: "junio")
    return texto.replace(/\b\w/g, l => l.toUpperCase()); // "13 De Junio De 2026"
  };

  useEffect(() => {
    clienteAxios.get('/partidos').then(res => {
        const ordenados = res.data.sort((a, b) => new Date(a.fechaPartido) - new Date(b.fechaPartido));
        setPartidos(ordenados);

        const equiposSet = new Set();
        ordenados.forEach(p => {
            if(p.equipoLocal) equiposSet.add(p.equipoLocal.nombre);
            if(p.equipoVisitante) equiposSet.add(p.equipoVisitante.nombre);
        });

        setListas({
            // Aquí guardamos las fechas YA formateadas bonitas para la lista
            fechas: [...new Set(ordenados.map(p => formatearFechaBonita(p.fechaPartido)))],
            fases: [...new Set(ordenados.map(p => p.fase?.nombre))],
            grupos: [...new Set(ordenados.map(p => p.equipoLocal?.grupo?.nombre).filter(Boolean))].sort(),
            equipos: [...equiposSet].sort()
        });
    });
  }, []);

  const partidosFiltrados = partidos.filter(p => {
      // Convertimos la fecha del partido al formato bonito para compararla con el filtro
      const fechaBonita = formatearFechaBonita(p.fechaPartido);
      
      const cumpleFecha = !filtroFecha || fechaBonita === filtroFecha;
      const cumpleFase = !filtroFase || p.fase?.nombre === filtroFase;
      
      // Lógica de Grupos Corregida
      const esFaseGrupos = p.fase?.nombre?.toLowerCase().includes('grupos');
      const cumpleGrupo = !filtroGrupo || (
          esFaseGrupos && 
          (p.equipoLocal?.grupo?.nombre === filtroGrupo || p.equipoVisitante?.grupo?.nombre === filtroGrupo)
      );

      const cumpleEquipo = !filtroEquipo || (p.equipoLocal?.nombre === filtroEquipo || p.equipoVisitante?.nombre === filtroEquipo);
      
      return cumpleFecha && cumpleFase && cumpleGrupo && cumpleEquipo;
  });

  const partidosPorFecha = partidosFiltrados.reduce((acc, p) => {
    const fecha = formatearFechaBonita(p.fechaPartido);
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(p);
    return acc;
  }, {});

  return (
    <div className="fixture-container">
      
      {/* --- BARRA DE FILTROS PERSONALIZADA --- */}
      <div className="filters-bar-custom">
        <NeonSelect 
          icon={Calendar} 
          label="Todas las Fechas" 
          value={filtroFecha} 
          options={listas.fechas} 
          onChange={setFiltroFecha} 
        />
        
        <NeonSelect 
          icon={Layers} 
          label="Todas las Fases" 
          value={filtroFase} 
          options={listas.fases} 
          onChange={setFiltroFase} 
        />
        
        <NeonSelect 
          icon={Users} 
          label="Todos los Grupos" 
          value={filtroGrupo} 
          options={listas.grupos} 
          onChange={setFiltroGrupo} 
        />
        
        <NeonSelect 
          icon={Shield} 
          label="Todos los Equipos" 
          value={filtroEquipo} 
          options={listas.equipos} 
          onChange={setFiltroEquipo} 
        />

        {/* Botón Reset */}
        {(filtroFecha || filtroFase || filtroGrupo || filtroEquipo) && (
             <button className="btn-reset-custom" onClick={() => {
                setFiltroFecha(''); setFiltroFase(''); setFiltroGrupo(''); setFiltroEquipo('');
            }}>
                Borrar Filtros
            </button>
        )}
      </div>

      {/* --- LISTA DE PARTIDOS --- */}
      <div className="matches-scroll-area">
        {Object.keys(partidosPorFecha).map(fecha => (
            <div key={fecha} className="fecha-bloque">
            <h3 className="fecha-title-neon">{fecha}</h3> 
            <div className="matches-grid">
                {partidosPorFecha[fecha].map(p => (
                <div key={p.id} className="match-card">
                    <div className="match-header-small">
                        {p.estadio?.ciudad} • {p.estadio?.nombre} • {new Date(p.fechaPartido).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="match-body">
                    <div className="team-col">
                        <img src={p.equipoLocal?.urlEscudo} className="team-flag" alt="" />
                        <span className="team-name">{p.equipoLocal?.nombre}</span>
                    </div>
                    
                    <div className="score-display">
                        {p.estado === 'FINALIZADO' 
                            ? (
                                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <span className="score-final">
                                        {p.golesLocalReal} - {p.golesVisitanteReal}
                                    </span>
                                    {p.golesPenalesLocal != null && p.golesPenalesVisitante != null && (
                                        <span className="penal-info">
                                            ({p.golesPenalesLocal} - {p.golesPenalesVisitante} pen.)
                                        </span>
                                    )}
                                </div>
                            )
                            : <span className="score-vs">VS</span>
                        }
                    </div>

                    <div className="team-col">
                        <img src={p.equipoVisitante?.urlEscudo} className="team-flag" alt="" />
                        <span className="team-name">{p.equipoVisitante?.nombre}</span>
                    </div>
                    </div>
                    <div className="match-footer-fase">{p.fase?.nombre}</div>
                </div>
                ))}
            </div>
            </div>
        ))}

        {partidosFiltrados.length === 0 && (
            <div className="empty-state">No se encontraron partidos con estos filtros.</div>
        )}
      </div>
    </div>
  );
};

export default FixtureGeneral;