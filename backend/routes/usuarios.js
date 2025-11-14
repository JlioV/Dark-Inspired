// backend/routes/usuarios.js
import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

const router = express.Router();

// POST /api/register
router.post("/register", async (req, res) => {
  try {
    const username = req.body.username || req.body.nombre_usuario;
    const email = (req.body.email || "").trim().toLowerCase();
    const plainPassword = req.body.password || req.body.contraseña;

    if (!username || !email || !plainPassword) {
      return res
        .status(400)
        .json({ error: "Faltan username, email o contraseña" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Ya existe un usuario con ese email o username" });
    }

    const hash = await bcrypt.hash(plainPassword, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );

    res.json({
      mensaje: "Usuario registrado con éxito",
      usuario: {
        id: result.insertId,
        id_usuario: result.insertId, // alias para el front
        username,
        email,
      },
    });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const plainPassword = req.body.password || req.body.contraseña;

    if (!email || !plainPassword) {
      return res
        .status(400)
        .json({ error: "Faltan email o contraseña" });
    }

    const [rows] = await pool.query(
      "SELECT id, username, email, password_hash FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(plainPassword, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: user.id,
        id_usuario: user.id, // alias compat
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
