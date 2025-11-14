import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

export default function Galeria({ onEditCharacter }) {
    const { user } = useAuth();
    const [personajes, setPersonajes] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!user) return;

        async function fetchPersonajes() {
            try {
                setCargando(true);
                const res = await fetch(
                    `http://localhost:3001/api/personajes/${user.id}`
                );
                const data = await res.json();
                setPersonajes(data);
            } catch (err) {
                console.error("Error cargando personajes:", err);
            } finally {
                setCargando(false);
            }
        }

        fetchPersonajes();
    }, [user]);

    const handleDelete = async (id_personaje) => {
        const seguro = window.confirm("¿Seguro que quieres borrar este personaje?");
        if (!seguro) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/personajes/${id_personaje}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                alert("No se pudo borrar el personaje.");
                return;
            }

            setPersonajes((prev) =>
                prev.filter((p) => p.id_personaje !== id_personaje)
            );
        } catch (err) {
            console.error("Error borrando personaje:", err);
            alert("Error al borrar el personaje.");
        }
    };

    if (!user) {
        return (
            <div className="galeria-container">
                <h2>Personajes guardados</h2>
                <div className="message-info">
                    Debes iniciar sesión para ver tus personajes guardados.
                </div>
            </div>
        );
    }

    return (
        <div className="galeria-container">
            <h2 className="galeria-title">Personajes guardados</h2>

            {cargando && <div className="message-info">Cargando personajes...</div>}

            {!cargando && personajes.length === 0 && (
                <div className="message-info">
                    Todavía no tienes personajes guardados. ¡Crea uno en el Creador!
                </div>
            )}

            {!cargando && personajes.length > 0 && (
                <div className="personajes-grid">
                    {personajes.map((p) => (
                        <div key={p.id_personaje} className="personaje-card">

                            <h3>{p.nombre_personaje}</h3>

                            {p.imageData && (
                                <img
                                    src={p.imageData}
                                    alt="previsualización"
                                    className="personaje-image"
                                />
                            )}

                            <div className="card-buttons">
                                <button
                                    className="load-btn"
                                    onClick={() => onEditCharacter && onEditCharacter(p)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(p.id_personaje)}
                                >
                                    Borrar
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
