import React, { useState, useEffect, useRef } from 'react';
import { Swords, ArrowLeft, X, Plus, Trophy, Layers, Users, Shield, ChevronDown } from 'lucide-react';
import clienteAxios from '../../configuracion/clienteAxios';
import './Rivales.css';

// --- COMPONENTE NEON SELECT (Reutilizable) ---
const NeonSelect = ({ icon: Icon, label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div 
        className={`neon-select-trigger ${isOpen ? 'active' : ''} ${value ? 'has-value' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-content">
          {Icon && <Icon size={16} className="trigger-icon" />}
          <span className="trigger-text">{value || label}</span>
        </div>
        <div className="trigger-actions">
           {value && (
             <span className="clear-icon" onClick={(e) => { e.stopPropagation(); onChange(""); }}>
               <X size={14} />
             </span>
           )}
           <ChevronDown size={16} className={`arrow-icon ${isOpen ? 'rotate' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <div className="neon-dropdown-menu animate-fade-in-fast">
          <div className={`neon-option ${value === "" ? 'selected' : ''}`} onClick={() => { onChange(""); setIsOpen(false); }}>
            {label} (Ver Todos)
          </div>
          {options.map((opt) => (
            <div key={opt} className={`neon-option ${value === opt ? 'selected' : ''}`} onClick={() => { onChange(opt); setIsOpen(false); }}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Rivales = () => {
  const [vista, setVista] = useState('DASHBOARD');
  
  // Datos Base
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [miPerfil, setMiPerfil] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros (Compartidos)
  const [filtroFase, setFiltroFase] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [listasFiltros, setListasFiltros] = useState({ fases: [], grupos: [], equipos: [] });

  // Tabla
  const [usuariosTablaIds, setUsuariosTablaIds] = useState([]);
  const [cachePredicciones, setCachePredicciones] = useState({});
  
  // VS
  const [rivalVS, setRivalVS] = useState(null);
  const [dataVS, setDataVS] = useState([]);

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const userStorage = JSON.parse(localStorage.getItem('usuario'));
        if (!userStorage) return;

        const [resRanking, resPartidos] = await Promise.all([
          clienteAxios.get('/usuarios/ranking'),
          clienteAxios.get('/partidos')
        ]);

        const todos = resRanking.data;
        const listaPartidos = resPartidos.data.sort((a, b) => a.numeroPartido - b.numeroPartido);

        const yo = todos.find(u => u.id === userStorage.id);
        const otros = todos.filter(u => u.id !== userStorage.id);

        setMiPerfil(yo || userStorage);
        setAllUsuarios(otros);
        setPartidos(listaPartidos);

        // Listas para Filtros
        const fases = [...new Set(listaPartidos.map(p => p.fase?.nombre))];
        const grupos = [...new Set(listaPartidos.map(p => p.equipoLocal?.grupo?.nombre).filter(Boolean))].sort();
        const equiposSet = new Set();
        listaPartidos.forEach(p => {
            if(p.equipoLocal) equiposSet.add(p.equipoLocal.nombre);
            if(p.equipoVisitante) equiposSet.add(p.equipoVisitante.nombre);
        });
        setListasFiltros({ fases, grupos, equipos: [...equiposSet].sort() });

        // Tabla Inicial
        const iniciales = [yo, ...otros].slice(0, 5).filter(Boolean);
        const idsIniciales = iniciales.map(u => u.id);
        setUsuariosTablaIds(idsIniciales);

        await cargarPrediccionesFaltantes(idsIniciales);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPrediccionesFaltantes = async (ids) => {
    const faltantes = ids.filter(id => !cachePredicciones[id]);
    if (faltantes.length === 0) return;

    const nuevasPreds = { ...cachePredicciones };
    await Promise.all(faltantes.map(async (id) => {
        try {
            const res = await clienteAxios.get(`/predicciones/usuario/${id}`);
            nuevasPreds[id] = res.data;
        } catch (error) {
            console.error(`Error cargando preds user ${id}:`, error);
            nuevasPreds[id] = [];
        }
    }));
    setCachePredicciones(nuevasPreds);
  };

  const agregarUsuarioATabla = async (idUsuario) => {
    if (usuariosTablaIds.length >= 5) return; 
    if (usuariosTablaIds.includes(idUsuario)) return;
    await cargarPrediccionesFaltantes([idUsuario]);
    setUsuariosTablaIds([...usuariosTablaIds, idUsuario]);
  };

  const quitarUsuarioDeTabla = (idUsuario) => {
    if (usuariosTablaIds.length <= 1) return;
    setUsuariosTablaIds(usuariosTablaIds.filter(id => id !== idUsuario));
  };

  const entrarAlVS = async (usuarioRival) => {
    setRivalVS(usuarioRival);
    setCargando(true);
    // Limpiar filtros al entrar
    setFiltroFase(''); setFiltroGrupo(''); setFiltroEquipo('');
    
    try {
        await cargarPrediccionesFaltantes([miPerfil.id, usuarioRival.id]);
        const misP = cachePredicciones[miPerfil.id] || [];
        const susP = cachePredicciones[usuarioRival.id] || [];

        const cruce = partidos.map(p => ({
            partido: p,
            yo: misP.find(pred => pred.partido.id === p.id),
            el: susP.find(pred => pred.partido.id === p.id)
        }));

        setDataVS(cruce);
        setVista('VS_ARENA');
    } catch (error) {
        console.error("Error al entrar VS:", error);
    } finally { 
        setCargando(false); 
    }
  };

  // --- FILTRADO ---
  const cumpleFiltros = (p) => {
      const cumpleFase = !filtroFase || p.fase?.nombre === filtroFase;
      const esFaseGrupos = p.fase?.nombre?.toLowerCase().includes('grupos');
      const cumpleGrupo = !filtroGrupo || (
          esFaseGrupos && 
          (p.equipoLocal?.grupo?.nombre === filtroGrupo || p.equipoVisitante?.grupo?.nombre === filtroGrupo)
      );
      const cumpleEquipo = !filtroEquipo || (p.equipoLocal?.nombre === filtroEquipo || p.equipoVisitante?.nombre === filtroEquipo);
      return cumpleFase && cumpleGrupo && cumpleEquipo;
  };

  // UI Compartida
  const FiltrosBarra = () => (
    <div className="filters-bar-general">
        <NeonSelect icon={Layers} label="Todas las Fases" value={filtroFase} options={listasFiltros.fases} onChange={setFiltroFase} />
        <NeonSelect icon={Users} label="Todos los Grupos" value={filtroGrupo} options={listasFiltros.grupos} onChange={setFiltroGrupo} />
        <NeonSelect icon={Shield} label="Todos los Equipos" value={filtroEquipo} options={listasFiltros.equipos} onChange={setFiltroEquipo} />
        {(filtroFase || filtroGrupo || filtroEquipo) && (
            <button className="btn-reset-filters" onClick={() => { setFiltroFase(''); setFiltroGrupo(''); setFiltroEquipo(''); }}>
                Borrar Filtros
            </button>
        )}
    </div>
  );

  const CeldaPrediccion = ({ pred }) => {
    if (!pred) return <span className="cell-empty">-</span>;
    const acerto = pred.puntosGanados > 0;
    return (
        <div className={`cell-content ${acerto ? 'cell-win' : ''}`}>
            <span className="cell-score">{pred.golesLocalPredicho}-{pred.golesVisitantePredicho}</span>
            {acerto && <span className="cell-pts">+{pred.puntosGanados}</span>}
        </div>
    );
  };

  const partidosTablaFiltrados = partidos.filter(cumpleFiltros);
  const dataVSFiltrada = dataVS.filter(item => cumpleFiltros(item.partido));

  const columnasUsuarios = usuariosTablaIds
    .map(id => (id === miPerfil?.id ? miPerfil : allUsuarios.find(u => u.id === id)))
    .filter(Boolean)
    .sort((a, b) => (a.id === miPerfil?.id ? -1 : b.id === miPerfil?.id ? 1 : 0));

  const disponiblesParaAgregar = allUsuarios.filter(u => !usuariosTablaIds.includes(u.id));

  if (cargando) return <div className="loading-screen">Cargando...</div>;

  return (
    <div className="rivales-wrapper animate-fade-in">
      
      {vista === 'DASHBOARD' && (
        <>
          <div className="section-cards">
            <h1 className="neon-title-large">ELIGE TU OPONENTE (1 vs 1)</h1>
            <div className="grid-rivales-scroll">
                {allUsuarios.map(u => (
                    <div key={u.id} className="card-mini-rival" onClick={() => entrarAlVS(u)}>
                        <div className="mini-avatar">{u.username.charAt(0).toUpperCase()}</div>
                        <div className="mini-info">
                            <span className="mini-name">{u.username}</span>
                            <span className="mini-pts">{u.puntosTotales} PTS</span>
                        </div>
                        <div className="mini-vs-btn"><Swords size={16}/></div>
                    </div>
                ))}
            </div>
          </div>

          <hr className="divider-neon" />

          <div className="section-table">
            <div className="table-header-control">
                <h2 className="table-section-title">TABLA COMPARATIVA ({usuariosTablaIds.length}/5)</h2>
                <div className="user-selector-area">
                    {usuariosTablaIds.length < 5 ? (
                        <div className="custom-dropdown">
                            <select className="select-add-user" onChange={(e) => { if(e.target.value) agregarUsuarioATabla(Number(e.target.value)); e.target.value = ""; }}>
                                <option value="">+ Agregar Rival a la Tabla</option>
                                {disponiblesParaAgregar.map(u => (
                                    <option key={u.id} value={u.id}>{u.username} ({u.puntosTotales} pts)</option>
                                ))}
                            </select>
                            <Plus size={16} className="plus-icon"/>
                        </div>
                    ) : (
                        <span className="limit-reached-msg">Límite alcanzado (5/5). Elimina uno para agregar.</span>
                    )}
                </div>
            </div>

            <FiltrosBarra />
            
            <div className="table-responsive-container">
                <table className="general-table">
                    <thead>
                        <tr>
                            <th className="th-sticky-match">
                                <div className="header-match-title">
                                    PARTIDO
                                    <span className="subtitle-real">
                                        <Trophy size={10} style={{marginRight:4}}/> RESULTADO REAL
                                    </span>
                                </div>
                            </th>
                            {columnasUsuarios.map(user => (
                                <th key={user.id} className={`th-user ${user.id === miPerfil.id ? 'th-me' : ''}`}>
                                    <div className="th-user-header">
                                        <div className="th-info">
                                            <span className="th-name">{user.username}</span>
                                            <span className="th-pts">{user.puntosTotales} pts</span>
                                        </div>
                                        {user.id !== miPerfil.id && (
                                            <button className="btn-remove-col" onClick={() => quitarUsuarioDeTabla(user.id)} title="Quitar"><X size={14} /></button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {partidosTablaFiltrados.length > 0 ? partidosTablaFiltrados.map((p) => {
                            const finalizado = p.estado === 'FINALIZADO';
                            const penales = p.golesPenalesLocal != null;
                            return (
                                <tr key={p.id}>
                                    <td className="td-sticky-match">
                                        <div className="match-cell-info">
                                            <div className="match-teams">
                                                <img src={p.equipoLocal?.urlEscudo} alt="" />
                                                <span className="m-vs">vs</span>
                                                <img src={p.equipoVisitante?.urlEscudo} alt="" />
                                            </div>
                                            {finalizado ? (
                                                <div className="match-result-box">
                                                    <span className="m-score">{p.golesLocalReal}-{p.golesVisitanteReal}</span>
                                                    {penales && <span className="m-penales">({p.golesPenalesLocal}-{p.golesPenalesVisitante})</span>}
                                                </div>
                                            ) : <span className="m-pending">Pendiente</span>}
                                        </div>
                                    </td>
                                    {columnasUsuarios.map(user => {
                                        const pred = cachePredicciones[user.id]?.find(pr => pr.partido.id === p.id);
                                        return (
                                            <td key={user.id} className={`td-pred ${user.id === miPerfil.id ? 'td-me-bg' : ''}`}>
                                                <CeldaPrediccion pred={pred} />
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={columnasUsuarios.length + 1} className="empty-msg">No se encontraron partidos con estos filtros.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </>
      )}

      {/* VISTA 2: VS ARENA (CON FILTROS Y ESTILO RECUPERADO) */}
      {vista === 'VS_ARENA' && (
        <div className="vs-arena-view animate-zoom-in">
           <button className="btn-back-dashboard" onClick={() => setVista('DASHBOARD')}>
              <ArrowLeft size={18} /> VOLVER AL TABLERO
           </button>

           <div className="vs-header-fight">
              <div className="fighter me">
                 <div className="f-avatar-big">{miPerfil.username.charAt(0)}</div>
                 <div className="f-name-big">TÚ</div>
                 <div className="f-pts-big">{miPerfil.puntosTotales} PTS</div>
              </div>
              <div className="vs-logo-animado">VS</div>
              <div className="fighter enemy">
                 <div className="f-avatar-big enemy-color">{rivalVS.username.charAt(0)}</div>
                 <div className="f-name-big enemy-text">{rivalVS.username}</div>
                 <div className="f-pts-big">{rivalVS.puntosTotales} PTS</div>
              </div>
           </div>

           {/* FILTROS DENTRO DEL VS */}
           <div className="vs-filters-container">
                <FiltrosBarra />
           </div>

           <div className="vs-list-fight">
              {dataVSFiltrada.length > 0 ? dataVSFiltrada.map((item) => (
                  <div key={item.partido.id} className="vs-fight-row">
                      {/* LADO TUYO (Style Cyberpunk) */}
                      <div className={`side-pred me-side ${item.yo?.puntosGanados > 0 ? 'win-glow' : ''}`}>
                          <span className="pred-label">TÚ</span>
                          <span className="pred-big">{item.yo ? `${item.yo.golesLocalPredicho}-${item.yo.golesVisitantePredicho}` : '-'}</span>
                          {item.yo?.puntosGanados > 0 && <span className="pts-badge">+{item.yo.puntosGanados}</span>}
                      </div>

                      <div className="center-fight-info">
                          <div className="fight-flags">
                             <img src={item.partido.equipoLocal?.urlEscudo} alt="" />
                             <span className="fight-vs">vs</span>
                             <img src={item.partido.equipoVisitante?.urlEscudo} alt="" />
                          </div>
                          <div className="fight-result-container">
                              {item.partido.estado === 'FINALIZADO' ? (
                                  <>
                                    <span className="fight-score-real">{item.partido.golesLocalReal} - {item.partido.golesVisitanteReal}</span>
                                    {item.partido.golesPenalesLocal != null && (
                                        <span className="fight-penales-text">
                                            ({item.partido.golesPenalesLocal} - {item.partido.golesPenalesVisitante} pen.)
                                        </span>
                                    )}
                                  </>
                              ) : <span className="fight-pending">Pendiente</span>}
                          </div>
                      </div>

                      {/* LADO RIVAL (Style Cyberpunk) */}
                      <div className={`side-pred enemy-side ${item.el?.puntosGanados > 0 ? 'win-glow-enemy' : ''}`}>
                          <span className="pred-label">{rivalVS.username}</span>
                          <span className="pred-big">{item.el ? `${item.el.golesLocalPredicho}-${item.el.golesVisitantePredicho}` : '-'}</span>
                          {item.el?.puntosGanados > 0 && <span className="pts-badge enemy-badge">+{item.el.puntosGanados}</span>}
                      </div>
                  </div>
              )) : (
                  <div className="empty-msg">No hay partidos para mostrar en este VS con los filtros actuales.</div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Rivales;