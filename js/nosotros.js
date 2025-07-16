document.addEventListener('DOMContentLoaded', () => {
    const formularioHistoria = document.getElementById('formulario-historia');
    const respuestaFormulario = document.getElementById('respuesta-formulario');
    const cuerpoTablaHistorias = document.getElementById('cuerpo-tabla-historias');
    const mensajeSinHistorias = document.getElementById('mensaje-sin-historias');
    
    const renderizarHistorias = () => {
        if (cuerpoTablaHistorias.children.length === 0) {
            mensajeSinHistorias.style.display = 'block';
        } else {
            mensajeSinHistorias.style.display = 'none';
        }
    };

    if (formularioHistoria) {
        formularioHistoria.addEventListener('submit', function(evento) {
            evento.preventDefault();

            const nombreDueño = document.getElementById('nombreDueño').value.trim();
            const nombreMascota = document.getElementById('nombreMascota').value.trim();
            const tipoExperiencia = document.getElementById('tipoExperiencia').value;
            const mensajeHistoria = document.getElementById('mensajeHistoria').value.trim();

            if (!nombreDueño || !nombreMascota || !tipoExperiencia || !mensajeHistoria) {
                respuestaFormulario.textContent = 'Por favor, completa todos los campos.';
                respuestaFormulario.style.color = 'red';
                return;
            }

            const nuevaFila = cuerpoTablaHistorias.insertRow();
            nuevaFila.innerHTML = `
                <td>${nombreDueño}</td>
                <td>${nombreMascota}</td>
                <td>${tipoExperiencia}</td>
                <td>${mensajeHistoria}</td>
            `;
            
            renderizarHistorias();

            respuestaFormulario.textContent = '¡Gracias por compartir tu historia!';
            respuestaFormulario.style.color = 'green';
            formularioHistoria.reset();

            setTimeout(() => {
                respuestaFormulario.textContent = '';
            }, 5000);
        });
    }

    renderizarHistorias();
});