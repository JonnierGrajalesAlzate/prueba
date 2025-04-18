document.addEventListener('DOMContentLoaded', function () {
  const empresaDetalles = document.getElementById('empresa-detalles');

  // Obtener el NIT de la URL
  const params = new URLSearchParams(window.location.search);
  const nit = params.get('nit');

  // Verificar si el NIT está presente en la URL
  if (!nit) {
      empresaDetalles.innerHTML = '<p>Error: No se proporcionó un NIT.</p>';
      return;
  }

  // Traer los datos de la empresa desde el backend usando el NIT
  fetch(`http://localhost:3000/empresas/${nit}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Empresa no encontrada');
          }
          return response.json();
      })
      .then(empresa => {
          let videoContent = 'No disponible';
          let ubicacionContent = 'No disponible';

          // Verificar si el video es un enlace de YouTube y crear el iframe
          if (empresa.video && empresa.video.includes("youtube.com")) {
              const videoId = empresa.video.split("v=")[1].split("&")[0]; // Obtener el ID del video
              videoContent = `
                  <div class="video-container">
                      <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>`;
          } else if (empresa.video) {
              // Si no es de YouTube, solo mostrar el enlace
              videoContent = `<a href="${empresa.video}" target="_blank">Ver Video</a>`;
          }

          // Verificar si la ubicación es un enlace de Google Maps y crear el iframe del mapa
          if (empresa.ubicacion && empresa.ubicacion.includes("maps.google.com")) {
              ubicacionContent = `
                  <div class="map-container">
                      <iframe src="${empresa.ubicacion}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                  </div>`;
          } else if (empresa.ubicacion) {
              // Si no es un enlace de Google Maps, mostrar un enlace hacia Google Maps con la ubicación
              ubicacionContent = `
                  <a href="https://www.google.com/maps?q=${encodeURIComponent(empresa.ubicacion)}" target="_blank">Ver en Google Maps</a>`;
          }

          empresaDetalles.innerHTML = `
              <h2>${empresa.nombre}</h2>
              <p><strong>NIT:</strong> ${empresa.nit}</p>
              <p><strong>Descripción:</strong> ${empresa.descripcion || 'Sin descripción'}</p>
              <p><strong>Aporte:</strong> ${empresa.aporte || 'No disponible'}</p>
              <p><strong>Instagram:</strong> ${empresa.instagram || 'No disponible'}</p>
              <p><strong>WhatsApp:</strong> ${empresa.whatsapp || 'No disponible'}</p>
              <p><strong>Correo:</strong> ${empresa.correo || 'No disponible'}</p>
              <p><strong>Ubicación:</strong> ${ubicacionContent}</p>
              <p><strong>Video:</strong> ${videoContent}</p>
          `;
      })
      .catch(error => {
          console.error(error);
          empresaDetalles.innerHTML = '<p>Error al cargar los detalles de la empresa.</p>';
      });
});
