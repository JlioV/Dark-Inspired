import express from "express";

export default (db) => {
    const router = express.Router();

    // ================================
    // 1. CREAR HISTORIA
    // ================================
    router.post("/historias", async (req, res) => {
        const { id_personaje, titulo, contenido } = req.body;

        if (!id_personaje || !titulo || !contenido) {
            return res.status(400).json({ error: "Faltan datos para guardar historia" });
        }

        try {
            const [result] = await db.query(
                `INSERT INTO historias (id_personaje, titulo, contenido, fecha)
                 VALUES (?, ?, ?, NOW())`,
                [id_personaje, titulo, contenido]
            );

            res.status(201).json({
                mensaje: "Historia guardada",
                id_historia: result.insertId,
            });

        } catch (err) {
            console.error("Error al guardar historia:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // ================================
    // 2. OBTENER HISTORIAS DE UN PERSONAJE
    // ================================
    router.get("/historias/:id_personaje", async (req, res) => {
        const { id_personaje } = req.params;

        try {
            const [rows] = await db.query(
                `SELECT id, id_personaje, titulo, contenido, fecha
                 FROM historias
                 WHERE id_personaje = ?
                 ORDER BY fecha DESC`,
                [id_personaje]
            );

            res.json(rows);

        } catch (err) {
            console.error("Error obteniendo historias:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });


    // ================================
    // 3. OBTENER HISTORIAS DEL USUARIO
    // ================================
    router.get("/historias/usuario/:id_usuario", async (req, res) => {
        const { id_usuario } = req.params;

        try {
            const [rows] = await db.query(
                `SELECT 
                    h.id,
                    h.id_personaje,
                    h.titulo,
                    h.contenido,
                    h.fecha,
                    p.nombre_personaje,
                    p.imageData
                 FROM historias h
                 JOIN personajes p
                    ON h.id_personaje = p.id
                 WHERE p.id_usuario = ?
                 ORDER BY h.fecha DESC`,
                [id_usuario]
            );

            res.json(rows);

        } catch (err) {
            console.error("Error obteniendo historias del usuario:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });


    // ================================
    // 4. BORRAR HISTORIA
    // ================================
    router.delete("/historias/:id_historia", async (req, res) => {
        const { id_historia } = req.params;

        try {
            const [result] = await db.query(
                "DELETE FROM historias WHERE id = ?",
                [id_historia]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Historia no encontrada" });
            }

            res.json({ mensaje: "Historia eliminada" });

        } catch (err) {
            console.error("Error borrando historia:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });


    // ================================
    // 5. EDITAR HISTORIA
    // ================================
    router.put("/historias/:id_historia", async (req, res) => {
        const { id_historia } = req.params;
        const { titulo, contenido } = req.body;

        try {
            const [result] = await db.query(
                `UPDATE historias 
                 SET titulo = ?, contenido = ?
                 WHERE id = ?`,
                [titulo, contenido, id_historia]
            );

            res.json({ mensaje: "Historia actualizada" });

        } catch (err) {
            console.error("Error editando historia:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    return router;
};
