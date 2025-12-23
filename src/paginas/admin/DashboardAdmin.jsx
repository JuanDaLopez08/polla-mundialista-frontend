import React from 'react';
import './DashboardAdmin.css'; 

const DashboardAdmin = () => {
  return (
    <div className="admin-container animate-fade-in">
      <div className="page-header-container">
          <h1 className="neon-title-large">PANEL DE ADMINISTRACIÓN</h1>
          <p className="neon-subtitle">Zona restringida. Gestiona el torneo desde aquí.</p>
      </div>

      <div className="admin-grid">
        {/* Tarjetas de Acceso Rápido */}
        <div className="admin-card">
            <h3>Resultados</h3>
            <p>Cargar marcadores reales.</p>
            <button className="btn-admin">Gestionar</button>
        </div>

        <div className="admin-card">
            <h3>Partidos</h3>
            <p>Editar horarios o estadios.</p>
            <button className="btn-admin">Gestionar</button>
        </div>

        <div className="admin-card">
            <h3>Usuarios</h3>
            <p>Ver lista de registrados.</p>
            <button className="btn-admin">Gestionar</button>
        </div>
        
        <div className="admin-card">
            <h3>Configuración</h3>
            <p>Puntos y reglas.</p>
            <button className="btn-admin">Gestionar</button>
        </div>
      </div>
    </div>
  );
};

// 👇 ESTA LÍNEA ES LA QUE TE FALTA O ESTÁ MAL ESCRITA 👇
export default DashboardAdmin;