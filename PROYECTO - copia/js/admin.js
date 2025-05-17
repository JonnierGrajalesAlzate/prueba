document.addEventListener('DOMContentLoaded', () => {
  const nombreUsuario = localStorage.getItem('usuarioNombre');
  const spanNombre = document.getElementById('usuarioNombre');

  if (nombreUsuario) {
    spanNombre.textContent = nombreUsuario;
  } else {
    spanNombre.textContent = 'Invitado';
  
    window.location.href = '../index.html';
  }

  const btnCerrar = document.getElementById('cerrarSesion');
  btnCerrar.addEventListener('click', () => {
    localStorage.removeItem('usuarioNombre'); // 
    window.location.href = '../index.html'; 
  });
});

