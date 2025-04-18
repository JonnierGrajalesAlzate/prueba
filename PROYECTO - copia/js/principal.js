document.addEventListener('DOMContentLoaded', function () {
    const empresasContainer = document.getElementById('empresas');
    const usuarioNombreElement = document.getElementById('usuarioNombre');
  
    // Mostrar nombre del usuario (desde localStorage)
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    usuarioNombreElement.textContent = usuarioNombre || 'Invitado';
  
    // Cargar empresas desde el backend
    fetch('http://localhost:3000/empresas')
      .then(response => response.json())
      .then(empresas => {
        mostrarEmpresas(empresas);
      })
      .catch(error => {
        console.error('Error al cargar empresas:', error);
      });
  
    // Mostrar tarjetas de empresas
    function mostrarEmpresas(empresas) {
      empresasContainer.innerHTML = '';
      empresas.forEach(empresa => {
        const div = document.createElement('div');
        div.classList.add('tarjeta');
        div.innerHTML = `
          <h3>${empresa.nombre}</h3>
          <p><strong>NIT:</strong> ${empresa.nit}</p>
          <p><strong>Descripción:</strong> ${empresa.descripcion || ''}</p>
          <button class="btn-ver" onclick="verDetalles('${empresa.nit}')">Ver detalles</button>
        `;
        empresasContainer.appendChild(div);
      });
    }
  });
  
  // Redirigir a empresa.html con el NIT
  function verDetalles(nit) {
    window.location.href = `empresa.html?nit=${encodeURIComponent(nit)}`;
  }
  
  // Toggle del menú lateral
  function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('mainContent');
    const toggleBtn = document.querySelector('.menu-toggle');
    const closeArrow = document.getElementById('closeArrow');
  
    const isHidden = sidebar.classList.toggle('hidden');
    content.classList.toggle('full-width');
  
    toggleBtn.style.display = isHidden ? 'block' : 'none';
    closeArrow.classList.toggle('hidden', isHidden);
  }
  