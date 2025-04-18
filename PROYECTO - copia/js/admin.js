document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productoForm');
    const mensaje = document.getElementById('mensaje');
    const empresasContainer = document.getElementById('empresas');
    const cantidadEmpresas = document.getElementById('cantidad-empresas-añadidas');
    const hiddenField = document.getElementById('hiddenNit');
    const submitButton = document.getElementById('submitButton');

    fetch('http://localhost:3000/empresas')
        .then(response => response.json())
        .then(empresas => {
            mostrarEmpresas(empresas);
            cantidadEmpresas.textContent = `Cantidad de empresas añadidas: ${empresas.length}`;
        })
        .catch(error => {
            console.error('Error al cargar empresas:', error);
        });

    function mostrarEmpresas(empresas) {
        empresasContainer.innerHTML = '';
        empresas.forEach(empresa => {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `
                <h3>${empresa.nombre}</h3>
                <p><strong>NIT:</strong> ${empresa.nit}</p>
                
                <p><strong>Ubicación:</strong> ${empresa.ubicacion}</p>
                <p><strong>Categoria:</strong> ${empresa.aporte}</p> 
                <p><strong>Correo:</strong> ${empresa.correo}</p>
                <button class="editar" data-id="${empresa.nit}">Actualizar</button>
                <button class="eliminar" data-id="${empresa.nit}">Eliminar</button>
            `;
            empresasContainer.appendChild(div);
        });

        document.querySelectorAll('.editar').forEach(button => {
            button.addEventListener('click', function() {
                const nit = button.getAttribute('data-id');
                editarEmpresa(nit);
            });
        });

        document.querySelectorAll('.eliminar').forEach(button => {
            button.addEventListener('click', function() {
                const nit = button.getAttribute('data-id');
                eliminarEmpresa(nit);
            });
        });
    }

    function editarEmpresa(nit) {
        fetch(`http://localhost:3000/empresas/${nit}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Empresa no encontrada');
                }
                return response.json();
            })
            .then(empresa => {
                document.getElementById('nit').value = empresa.nit;
                document.getElementById('nombre').value = empresa.nombre;
                document.getElementById('descripcion').value = empresa.descripcion;
                document.getElementById('ubicacion').value = empresa.ubicacion;
                document.getElementById('aporte').value = empresa.aporte;
                document.getElementById('video').value = empresa.video;
                document.getElementById('instagram').value = empresa.instagram;
                document.getElementById('whatsapp').value = empresa.whatsapp;
                document.getElementById('correo').value = empresa.correo;

                hiddenField.value = nit;
                submitButton.textContent = 'Actualizar';

                form.removeEventListener('submit', handleInsertSubmit);
                form.addEventListener('submit', handleUpdateSubmit);
            })
            .catch(error => {
                console.error('Error al cargar empresa:', error);
                mostrarMensaje('Error al cargar empresa para editar', 'red');
            });
    }

    function handleUpdateSubmit(event) {
        event.preventDefault();

        const nit = hiddenField.value;
        const empresa = {
            nit: document.getElementById('nit').value,
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            ubicacion: document.getElementById('ubicacion').value,
            aporte: document.getElementById('aporte').value,
            video: document.getElementById('video').value,
            instagram: document.getElementById('instagram').value,
            whatsapp: document.getElementById('whatsapp').value,
            correo: document.getElementById('correo').value,
        };

        fetch(`http://localhost:3000/empresas/${nit}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresa),
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje('Empresa actualizada correctamente', 'green');
            form.reset();
            hiddenField.value = '';
            submitButton.textContent = 'Registrar';
            cargarEmpresas();
            form.removeEventListener('submit', handleUpdateSubmit);
            form.addEventListener('submit', handleInsertSubmit);
        })
        .catch(error => {
            console.error('Error al actualizar empresa:', error);
            mostrarMensaje('Error al actualizar la empresa', 'red');
        });
    }

    function handleInsertSubmit(event) {
        event.preventDefault();

        if (hiddenField.value === '') {
            const empresa = {
                nit: document.getElementById('nit').value,
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                ubicacion: document.getElementById('ubicacion').value,
                aporte: document.getElementById('aporte').value,
                video: document.getElementById('video').value,
                instagram: document.getElementById('instagram').value,
                whatsapp: document.getElementById('whatsapp').value,
                correo: document.getElementById('correo').value,
            };

            fetch('http://localhost:3000/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresa),
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje('Empresa añadida correctamente', 'green');
                form.reset();
                cargarEmpresas();
            })
            .catch(error => {
                console.error('Error al añadir la empresa:', error);
                mostrarMensaje('Error al añadir la empresa', 'red');
            });
        } else {
            mostrarMensaje('Para insertar una nueva empresa, debe resetear el formulario', 'red');
        }
    }

    function eliminarEmpresa(nit) {
        fetch(`http://localhost:3000/empresas/${nit}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje('Empresa eliminada correctamente', 'green');
            cargarEmpresas();
        })
        .catch(error => {
            console.error('Error al eliminar empresa:', error);
            mostrarMensaje('Error al eliminar la empresa', 'red');
        });
    }

    function mostrarMensaje(mensajeTexto, color) {
        if (mensaje) {
            mensaje.textContent = mensajeTexto;
            mensaje.style.color = color;
            setTimeout(() => {
                mensaje.textContent = '';
            }, 3000);
        } else {
            console.warn('Elemento con id="mensaje" no encontrado en el HTML.');
        }
    }

    function cargarEmpresas() {
        fetch('http://localhost:3000/empresas')
            .then(response => response.json())
            .then(empresas => {
                mostrarEmpresas(empresas);
                cantidadEmpresas.textContent = `Cantidad de empresas añadidas: ${empresas.length}`;
            })
            .catch(error => {
                console.error('Error al cargar empresas:', error);
            });
    }

    form.addEventListener('submit', handleInsertSubmit);
});
