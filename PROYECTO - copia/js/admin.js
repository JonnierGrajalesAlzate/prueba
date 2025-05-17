app.post('/login', (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const sql = 'SELECT * FROM usuario WHERE correo = ? AND password = ?';
    db.get(sql, [correo, password], (err, row) => {
        if (err) {
            console.error('Error al verificar el usuario:', err.message);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario: row });
    });
});

