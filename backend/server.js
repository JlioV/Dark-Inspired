// backend/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

import personajesRouter from "./routes/personajes.js";
import historiasRouter from "./routes/historias.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

let db;
try {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kaladin",
    database: "dnd_creador",
  });

  console.log("✅ Conectado a MySQL (dnd_creador)");
} catch (err) {
  console.error("❌ Error al conectar:", err);
}

// -------------------------
// REGISTRO
// -------------------------
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );

    res.json({ mensaje: "Usuario registrado con éxito" });
  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// -------------------------
// LOGIN
// -------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id, username, password_hash FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    const esValida = await bcrypt.compare(password, usuario.password_hash);

    if (!esValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      id_usuario: usuario.id,
      username: usuario.username,
    });

  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});


app.use("/api", personajesRouter(db));
app.use("/api", historiasRouter(db));

app.listen(3001, () => console.log("🚀 Backend en http://localhost:3001"));
