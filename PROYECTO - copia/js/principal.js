document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const mensajeDiv = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;

        if (!correo || !password) {
            mostrarMensaje('Correo y contraseña son obligatorios.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensaje('Inicio de sesión exitoso.', 'success');
                // Aquí puedes redirigir al usuario si es necesario, por ejemplo:
                // window.location.href = 'dashboard.html';
            } else {
                mostrarMensaje(data.error || 'Correo o contraseña incorrectos.', 'error');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarMensaje('Error de conexión con el servidor.', 'error');
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
    }
});