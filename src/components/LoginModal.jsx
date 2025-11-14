import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function LoginModal({ visible, close }) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!visible) return null;

    const handleLogin = async () => {
        const res = await login(email, password);

        if (!res.ok) {
            setError(res.mensaje);
        } else {
            close();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <h2>Iniciar Sesión</h2>

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-text">{error}</p>}

                <button className="gold-btn" onClick={handleLogin}>
                    Entrar
                </button>

                <button className="close-btn" onClick={close}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}
