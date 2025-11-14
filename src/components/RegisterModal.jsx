import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function RegisterModal({ visible, close }) {
    const { register } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    if (!visible) return null;

    const handleRegister = async () => {
        const res = await register(username, email, password);

        if (res.error) {
            setMsg(res.error);
        } else {
            setMsg("Registrado con éxito ✔");
            setTimeout(() => close(), 1000);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <h2>Registro</h2>

                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

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

                {msg && <p className="info-text">{msg}</p>}

                <button className="gold-btn" onClick={handleRegister}>
                    Crear Cuenta
                </button>

                <button className="close-btn" onClick={close}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}
