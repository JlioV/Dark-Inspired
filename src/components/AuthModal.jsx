import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // LOGIN REAL
    const login = async (email, contraseña) => {
        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña }),
        });

        const data = await res.json();

        if (res.ok) {
            setUser({
                id: data.id_usuario,
                username: data.usuario,
                email: email
            });
            return { ok: true };
        } else {
            return { ok: false, mensaje: data.mensaje };
        }
    };

    // REGISTRO REAL
    const register = async (username, email, contraseña) => {
        const res = await fetch("http://localhost:3001/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, contraseña }),
        });

        return await res.json();
    };

    // LOGOUT
    const logout = () => setUser(null);
 
    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
