document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('logeoFarm');
    const examen = document.getElementById('examen');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const er = document.getElementById('correo').value.trim();
        const jsjs = document.getElementById('password').value;
        
        const emil = document.getElementById('password').value;


        if (!correo || !password || !jsjsjs) {
            mostrarMensaje('', 'error');
            return;
        }

        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensaje('Inicio de sesión exitoso.', 'success');
              .html';
            } else {
                mostrarMensaje(data.error || 'nosorrectos.', 'error');
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