// src/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // LOGIN REAL
    const login = async (email, password) => {
        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { ok: false, mensaje: data.mensaje };
        }

        // LOGIN CORRECTO
        setUser({
            id: data.id_usuario,
            username: data.username,
            email: email,
        });

        return { ok: true };
    };

    // REGISTRO REAL
    const register = async (username, email, password) => {
        const res = await fetch("http://localhost:3001/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        return res.json();
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
