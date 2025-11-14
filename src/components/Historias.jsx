import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

export default function Historias() {

    const { user } = useAuth();
    const [historias, setHistorias] = useState([]);
    const [cargando, setCargando] = useState(false);

    // ===========================
    // BORRAR HISTORIA
    // ===========================
    const borrarHistoria = async (id_historia) => {
        if (!window.confirm("¿Seguro que querés borrar esta historia?")) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/historias/${id_historia}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                setHistorias(historias.filter(h => h.id !== id_historia));
            }

        } catch (error) {
            console.error("❌ Error borrando historia:", error);
        }
    };

    // ===========================
    // EDITAR HISTORIA
    // ===========================
    const editarHistoria = async (h) => {
        const nuevoTitulo = prompt("Nuevo título:", h.titulo);
        if (!nuevoTitulo) return;

        const nuevoContenido = prompt("Nuevo contenido:", h.contenido);
        if (!nuevoContenido) return;

        try {
            await fetch(
                `http://localhost:3001/api/historias/${h.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        titulo: nuevoTitulo,
                        contenido: nuevoContenido,
                    }),
                }
            );

            // actualizar el estado
            setHistorias(
                historias.map(item =>
                    item.id === h.id
                        ? { ...item, titulo: nuevoTitulo, contenido: nuevoContenido }
                        : item
                )
            );

        } catch (err) {
            console.error("❌ Error editando:", err);
        }
    };

    // ===========================
    // CARGAR HISTORIAS
    // ===========================
    useEffect(() => {
        if (!user) return;

        async function fetchHistorias() {
            setCargando(true);
            try {
                const res = await fetch(
                    `http://localhost:3001/api/historias/usuario/${user.id}`
                );
                const data = await res.json();
                setHistorias(data);
            } catch (error) {
                console.error("❌ Error cargando historias:", error);
            } finally {
                setCargando(false);
            }
        }

        fetchHistorias();
    }, [user]);


    if (!user) {
        return (
            <div className="galeria-container">
                <h2 className="galeria-title">Historias Guardadas</h2>
                <div className="message-info">Debes iniciar sesión para ver tus historias.</div>
            </div>
        );
    }

    return (
        <div className="galeria-container">
            <h2 className="galeria-title">Historias Guardadas</h2>

            {cargando && <div className="message-info">Cargando...</div>}

            {!cargando && historias.length === 0 && (
                <div className="message-info">Aún no escribiste historias.</div>
            )}

            <div className="personajes-grid">
                {historias.map((h) => (
                    <div key={h.id} className="personaje-card">

                        <h3>{h.nombre_personaje}</h3>

                        {h.imageData && (
                            <img
                                className="personaje-image"
                                src={h.imageData}
                                alt="personaje"
                            />
                        )}

                        <h4 style={{ color: "var(--color-primary)", marginTop: "8px" }}>
                            {h.titulo}
                        </h4>

                        <p style={{
                            margin: "12px 0",
                            whiteSpace: "pre-line",
                            textAlign: "left",
                            color: "#ddd"
                        }}>
                            {h.contenido}
                        </p>

                        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                            {new Date(h.fecha).toLocaleString()}
                        </p>

                        {/* BOTONES → MISMO ESTILO QUE GALERÍA */}
                        <div className="card-buttons">
                            <button
                                className="load-btn"
                                onClick={() => editarHistoria(h)}
                            >
                                Editar
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => borrarHistoria(h.id)}
                            >
                                Borrar
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
