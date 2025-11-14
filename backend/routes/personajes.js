// backend/routes/personajes.js
import express from "express";

export default (db) => {
    const router = express.Router();

    // Crear personaje
    router.post("/personajes", async (req, res) => {
        const { id_usuario, nombre_personaje, cuerpo, cara, pelo, armadura, arma, zoom, imageData } = req.body;

        if (!id_usuario || !cuerpo) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        try {
            const [result] = await db.query(
                `INSERT INTO personajes (id_usuario, nombre_personaje, cuerpo, cara, pelo, armadura, arma, zoom, imageData)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id_usuario, nombre_personaje, cuerpo, cara, pelo, armadura, arma, zoom, imageData]
            );

            res.status(201).json({ mensaje: "Personaje creado", id_personaje: result.insertId });

        } catch (err) {
            console.error("Error al crear personaje:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Obtener personajes por usuario
    router.get("/personajes/:id_usuario", async (req, res) => {
        const { id_usuario } = req.params;

        try {
            const [rows] = await db.query(
                "SELECT * FROM personajes WHERE id_usuario = ?",
                [id_usuario]
            );

            const personajes = rows.map(p => ({
                id_personaje: p.id,
                nombre_personaje: p.nombre_personaje,
                zoom: p.zoom,
                imageData: p.imageData,
                capas: {
                    cuerpo: p.cuerpo,
                    cara: p.cara,
                    pelo: p.pelo,
                    armadura: p.armadura,
                    arma: p.arma,
                }
            }));

            res.json(personajes);

        } catch (err) {
            console.error("Error GET personajes:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Actualizar personaje
    router.put("/personajes/:id_personaje", async (req, res) => {
        const { id_personaje } = req.params;
        const {
            nombre_personaje,
            cuerpo,
            cara,
            pelo,
            armadura,
            arma,
            zoom,
            imageData
        } = req.body;

        try {
            const [result] = await db.query(
                `UPDATE personajes SET nombre_personaje = ?, cuerpo = ?, cara = ?, pelo = ?, armadura = ?, arma = ?, zoom = ?, imageData = ?
                 WHERE id = ?`,
                [nombre_personaje, cuerpo, cara, pelo, armadura, arma, zoom, imageData, id_personaje]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Personaje no encontrado" });
            }

            res.json({ mensaje: "Personaje actualizado" });

        } catch (err) {
            console.error("Error PUT personajes:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Borrar personaje
    router.delete("/personajes/:id_personaje", async (req, res) => {
        const { id_personaje } = req.params;

        try {
            const [result] = await db.query(
                "DELETE FROM personajes WHERE id = ?",
                [id_personaje]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Personaje no encontrado" });
            }

            res.json({ mensaje: "Personaje eliminado" });

        } catch (err) {
            console.error("Error DELETE personajes:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    return router;
};
