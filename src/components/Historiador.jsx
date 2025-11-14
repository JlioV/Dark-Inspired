import React, { useEffect, useState } from "react";

export default function Historiador({
    personajeId,
    nombre,
    historia,
    onChangeHistoria,
}) {
    const [titulo, setTitulo] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // 🔥 NUEVO: historias ya guardadas
    const [historiasGuardadas, setHistoriasGuardadas] = useState([]);

    // ============================================================
    // 1. Cargar historias guardadas cuando cambia el personaje
    // ============================================================
    useEffect(() => {
        if (!personajeId) return;

        async function fetchHistorias() {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/historias/${personajeId}`
                );
                const data = await res.json();
                setHistoriasGuardadas(data);
            } catch (err) {
                console.error("Error cargando historias:", err);
            }
        }

        fetchHistorias();
    }, [personajeId]);

    // ============================================================
    // 2. Guardar historia
    // ============================================================
    const saveHistoria = async () => {
        if (!personajeId) {
            alert("Primero guarda el personaje para generar un ID.");
            return;
        }

        if (!titulo.trim() || !historia.trim()) {
            alert("Debe haber un título y un texto de historia.");
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("http://localhost:3001/api/historias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_personaje: personajeId,
                    titulo,
                    contenido: historia,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Historia guardada ✔");

                // recargar lista de historias
                setHistoriasGuardadas((prev) => [
                    {
                        id: data.id_historia,
                        titulo,
                        contenido: historia,
                        fecha: new Date().toISOString(),
                    },
                    ...prev,
                ]);

                setTitulo("");
                onChangeHistoria(""); // limpiar textarea
            } else {
                setMessage("Error al guardar historia.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error de conexión.");
        }

        setSaving(false);
    };

    return (
        <div className="historia-area">
            <h2 className="historia-title">Historia</h2>

            {}
            <div className="historia-form">

                <input
                    type="text"
                    placeholder="Título del capítulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                    placeholder="Escribe la historia..."
                    value={historia}
                    onChange={(e) => onChangeHistoria(e.target.value)}
                />

                <button
                    className="save-story-btn"
                    onClick={saveHistoria}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar Historia"}
                </button>

                {message && (
                    <div className="historia-status success">{message}</div>
                )}
            </div>

            {}
            {historiasGuardadas.length > 0 && (
                <div style={{ marginTop: "35px" }}>
                    <h3 className="historia-title">Capítulos guardados</h3>

                    {historiasGuardadas.map((h) => (
                        <div
                            key={h.id}
                            style={{
                                background: "#0d0d0d",
                                border: "1px solid #333",
                                padding: "15px",
                                borderRadius: "6px",
                                marginBottom: "14px",
                            }}
                        >
                            <h4 style={{ color: "var(--color-primary)" }}>
                                {h.titulo}
                            </h4>

                            <p style={{ whiteSpace: "pre-line" }}>{h.contenido}</p>

                            <div
                                style={{
                                    marginTop: "8px",
                                    fontSize: "0.8rem",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Guardado el:{" "}
                                {new Date(h.fecha).toLocaleString("es-AR")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
