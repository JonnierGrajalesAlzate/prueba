const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors'); // Agregar CORS
const app = express();

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./empresasDB.db');

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para poder recibir el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Ruta para obtener todas las empresas
app.get('/empresas', (req, res) => {
    const sql = 'SELECT * FROM empresas';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener empresas:', err.message);
            return res.status(500).json({ error: 'Error al obtener empresas' });
        }
        res.json(rows);
    });
});

// Ruta para obtener una empresa por NIT
app.get('/empresas/:nit', (req, res) => {
    const { nit } = req.params;
    const sql = 'SELECT * FROM empresas WHERE nit = ?';
    db.get(sql, [nit], (err, row) => {
        if (err) {
            console.error('Error al obtener la empresa:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json(row);
    });
});

// Ruta para agregar una nueva empresa
app.post('/empresas', (req, res) => {
    const { nit, nombre, descripcion, ubicacion, aporte, video, instagram, whatsapp, correo } = req.body;
    const sql = `
        INSERT INTO empresas (nit, nombre, descripcion, ubicacion, aporte, video, instagram, whatsapp, correo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nit, nombre, descripcion, ubicacion, aporte, video, instagram, whatsapp, correo], function(err) {
        if (err) {
            console.error('Error al añadir la empresa:', err.message);
            return res.status(500).json({ error: 'Error al añadir la empresa' });
        }
        res.status(201).json({ mensaje: 'Empresa añadida correctamente', id: this.lastID });
    });
});

// Ruta para actualizar una empresa
app.put('/empresas/:nit', (req, res) => {
    const nit = req.params.nit;
    const { nombre, descripcion, ubicacion, aporte, video, instagram, whatsapp, correo } = req.body;

    const sql = `
        UPDATE empresas SET
            nombre = ?,
            descripcion = ?,
            ubicacion = ?,
            aporte = ?,
            video = ?,
            instagram = ?,
            whatsapp = ?,
            correo = ?
        WHERE nit = ?
    `;

    db.run(sql, [nombre, descripcion, ubicacion, aporte, video, instagram, whatsapp, correo, nit], function(err) {
        if (err) {
            console.error('Error al actualizar la empresa:', err);
            return res.status(500).json({ error: 'Error al actualizar la empresa' });
        } else if (this.changes === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json({ mensaje: 'Empresa actualizada correctamente' });
    });
});

// Ruta para eliminar una empresa
app.delete('/empresas/:nit', (req, res) => {
    const nit = req.params.nit;
    const sql = 'DELETE FROM empresas WHERE nit = ?';

    db.run(sql, [nit], function(err) {
        if (err) {
            console.error('Error al eliminar la empresa:', err.message);
            return res.status(500).json({ error: 'Error al eliminar la empresa' });
        } else if (this.changes === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json({ mensaje: 'Empresa eliminada correctamente' });
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
