import express from "express"
import cors from "cors"
import pool from "./db/pool.js"
import { nanoid } from "nanoid"

const app = express()

app.use(express.json())
app.use(cors())

export const DOMAIN = process.env.DOMAIN || "http://localhost:3000"

app.get("/check", async (req, res) => {
    res.status(200).json({ message: "health" })
});

app.post('/shorten', async (req, res) => {
    const { original_url } = req.body;
    const short_code = nanoid(6);
    const createdAt = new Date()

    try {
        const query = 'INSERT INTO links (original_url, short_code, createdAt) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [original_url, short_code, createdAt]);
        console.log(DOMAIN);
        
        res.json({ short_url: `${DOMAIN}/${short_code}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});


app.get('/:short_code', async (req, res) => {
    const { short_code } = req.params;

    try {
        // Buscar la URL original en la base de datos
        const query = 'SELECT original_url FROM links WHERE short_code = ?';
        const [results] = await pool.query(query, [short_code]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Enlace no encontrado' });
        }

        // Redirigir a la URL original
        const original_url = results[0].original_url;
        res.redirect(original_url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default app