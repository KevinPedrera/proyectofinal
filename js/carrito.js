document.addEventListener('DOMContentLoaded', () => {
    const contenedorItems = document.getElementById('contenedor-items');
    const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
    const resumenSubtotal = document.getElementById('resumen-subtotal');
    const resumenTotal = document.getElementById('resumen-total');
    const resumenCarrito = document.getElementById('resumen-carrito');
    const formularioFacturacion = document.getElementById('formulario-facturacion');
    const botonPagar = document.getElementById('boton-pagar');

    const renderizarCarrito = () => {
        const carrito = window.obtenerCarrito();
        contenedorItems.innerHTML = '';
        let subtotal = 0;

        if (carrito.length === 0) {
            mensajeCarritoVacio.style.display = 'block';
            resumenCarrito.style.display = 'none';
            formularioFacturacion.style.display = 'none';
            return;
        }

        mensajeCarritoVacio.style.display = 'none';
        resumenCarrito.style.display = 'block';
        formularioFacturacion.style.display = 'block';

        carrito.forEach(item => {
            const elementoItem = document.createElement('div');
            elementoItem.classList.add('tarjeta-item-carrito');
            const subtotalItem = item.precio * item.cantidad;
            subtotal += subtotalItem;
            elementoItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="detalles-item-carrito"><h3 class="font-bold">${item.nombre}</h3><p class="text-sm text-gray-600">$${item.precio.toFixed(2)}</p></div>
                <div class="controles-cantidad"><button class="btn-cantidad" data-id="${item.id}" data-cambio="-1">-</button><span>${item.cantidad}</span><button class="btn-cantidad" data-id="${item.id}" data-cambio="1">+</button></div>
                <p class="font-bold w-20 text-end">$${subtotalItem.toFixed(2)}</p>
                <button class="btn-eliminar" data-id="${item.id}">X</button>
            `;
            contenedorItems.appendChild(elementoItem);
        });

        resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        resumenTotal.textContent = `$${subtotal.toFixed(2)}`;
    };

    contenedorItems.addEventListener('click', (e) => {
        const objetivo = e.target;
        const carrito = window.obtenerCarrito();
        if (objetivo.matches('.btn-cantidad') || objetivo.matches('.btn-eliminar')) {
            const itemId = objetivo.dataset.id;
            const itemIndex = carrito.findIndex(i => i.id === itemId);

            if (itemIndex === -1) return;

            if (objetivo.matches('.btn-cantidad')) {
                const cambio = parseInt(objetivo.dataset.cambio, 10);
                carrito[itemIndex].cantidad += cambio;
                if (carrito[itemIndex].cantidad <= 0) {
                    carrito.splice(itemIndex, 1);
                }
            } else {
                carrito.splice(itemIndex, 1);
            }
            window.guardarCarrito(carrito);
            renderizarCarrito();
        }
    });

    const campos = {
        nombre: { regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/, error: "Debe contener solo letras y ser mayor a 3 caracteres." },
        cedula: { regex: /^\d{10}(\d{3})?$/, error: "Debe ser un número de 10 o 13 dígitos." },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Ingrese un formato de correo válido." },
        telefono: { regex: /^(09|02|03|04|05|06|07)\d{8}$/, error: "Debe ser un número de teléfono válido de Ecuador (10 dígitos)." },
        provincia: { regex: /.{3,}/, error: "La provincia es obligatoria." },
        ciudad: { regex: /.{3,}/, error: "La ciudad es obligatoria." },
        direccion: { regex: /.{10,}/, error: "La dirección debe tener al menos 10 caracteres." },
        envio: { regex: /^(si|no)$/, error: "Debe seleccionar una opción de envío." }
    };

    const validarCampo = (id) => {
        const input = document.getElementById(id);
        const errorP = document.getElementById(`error-${id}`);
        const { regex, error } = campos[id];
        
        if (regex.test(input.value.trim())) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
            errorP.textContent = '';
            return true;
        } else {
            input.classList.remove('border-green-500');
            input.classList.add('border-red-500');
            errorP.textContent = error;
            return false;
        }
    };
    
    const validarFormularioCompleto = () => {
        const esValido = Object.keys(campos).every(id => validarCampo(id));
        botonPagar.disabled = !esValido;
    };

    Object.keys(campos).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                validarCampo(id);
                validarFormularioCompleto();
            });
        }
    });
    
    formularioFacturacion.addEventListener('submit', async (e) => {
        e.preventDefault();
        validarFormularioCompleto();
        if (botonPagar.disabled) return;

        botonPagar.disabled = true;
        const mensajeExitoso = document.getElementById('mensaje-envio-exitoso');
        mensajeExitoso.textContent = "Procesando su orden... (Simulación)";
        mensajeExitoso.style.color = 'blue';

        await new Promise(resolve => setTimeout(resolve, 2000));

        mensajeExitoso.textContent = "¡Orden procesada con éxito! Gracias por tu compra.";
        mensajeExitoso.style.color = 'green';

        setTimeout(() => {
            formularioFacturacion.reset();
            document.querySelectorAll('.input-formulario').forEach(input => {
                input.classList.remove("border-green-500", "border-red-500");
            });
            window.guardarCarrito([]);
            renderizarCarrito();
        }, 3000);
    });

    renderizarCarrito();
});