import React from "react";
import { useAuth } from "../AuthContext";

export default function Header({
  currentView,
  setCurrentView,
  openLogin,
  openRegister,
}) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-inner">

        <div className="header-title">Dark Inspired</div>

        <nav className="nav-links">
          <button
            className={currentView === "creator" ? "active" : ""}
            onClick={() => setCurrentView("creator")}
          >
            CREADOR
          </button>

          <button
            className={currentView === "gallery" ? "active" : ""}
            onClick={() => setCurrentView("gallery")}
          >
            PERSONAJES
          </button>

          <button
            className={currentView === "stories" ? "active" : ""}
            onClick={() => setCurrentView("stories")}
          >
            HISTORIAS
          </button>
        </nav>

        <div className="auth-section">
          {user && (
            <span className="user-name">
              {user.username ? `Bienvenido, ${user.username}` : "Sesión activa"}
            </span>
          )}

          {user ? (
            <button className="logout-btn" onClick={logout}>
              CERRAR SESIÓN
            </button>
          ) : (
            <>
              <button className="login-btn" onClick={openLogin}>
                INICIAR SESIÓN
              </button>
              <button className="registro-btn" onClick={openRegister}>
                REGISTRARSE
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
