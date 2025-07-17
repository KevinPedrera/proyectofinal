document.addEventListener('DOMContentLoaded', () => {
    firebase.initializeApp({
        apiKey: "AIzaSyDfmSjgrBmKkVd_OirGB_Bf2JUtN3PVkBA",
        authDomain: "proyectofinal-b1934.firebaseapp.com",
        projectId: "proyectofinal-b1934",
        storageBucket: "proyectofinal-b1934.appspot.com",
        messagingSenderId: "896052592037",
        appId: "1:896052592037:web:d4f1ad8149a35bf89a3c4c",
        measurementId: "G-GZF3X67EL0"
    });
    const db = firebase.firestore();

    const contenedorItems = document.getElementById('contenedor-items');
    const formularioFacturacion = document.getElementById('formulario-facturacion');
    const botonPagar = document.getElementById('boton-pagar');

    const renderizarCarrito = () => {
        const carrito = window.obtenerCarrito();
        const resumenSubtotal = document.getElementById('resumen-subtotal');
        const resumenTotal = document.getElementById('resumen-total');
        const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
        const resumenCarrito = document.getElementById('resumen-carrito');
        if (!contenedorItems) return;

        contenedorItems.innerHTML = '';
        let subtotal = 0;

        if (carrito.length === 0) {
            if (mensajeCarritoVacio) mensajeCarritoVacio.style.display = 'block';
            if (resumenCarrito) resumenCarrito.style.display = 'none';
            if (formularioFacturacion) formularioFacturacion.style.display = 'none';
            return;
        }

        if (mensajeCarritoVacio) mensajeCarritoVacio.style.display = 'none';
        if (resumenCarrito) resumenCarrito.style.display = 'block';
        if (formularioFacturacion) formularioFacturacion.style.display = 'block';

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

        if (resumenSubtotal) resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (resumenTotal) resumenTotal.textContent = `$${subtotal.toFixed(2)}`;
    };

    if (contenedorItems) {
        contenedorItems.addEventListener('click', (e) => {
            const objetivo = e.target;
            if (!objetivo.matches('.btn-cantidad') && !objetivo.matches('.btn-eliminar')) return;
            const carrito = window.obtenerCarrito();
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
        });
    }

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
        if (!input || !errorP) return false;
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
        if (botonPagar) botonPagar.disabled = !esValido;
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
    
    if (formularioFacturacion) {
        formularioFacturacion.addEventListener('submit', async (e) => {
            e.preventDefault();
            validarFormularioCompleto();
            if (botonPagar.disabled) return;
            
            botonPagar.disabled = true;
            const mensajeExitoso = document.getElementById('mensaje-envio-exitoso');

            mensajeExitoso.textContent = "Procesando pago... Por favor, espere.";
            mensajeExitoso.style.color = 'blue';
            mensajeExitoso.classList.add('visible');

            await new Promise(resolve => setTimeout(resolve, 4000));

            const productosDelCarrito = window.obtenerCarrito();
            const productosParaGuardar = productosDelCarrito.map(item => ({
                id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad
            }));

            const orden = {
                cliente: {
                    nombre: document.getElementById('nombre').value,
                    cedula: document.getElementById('cedula').value,
                    email: document.getElementById('email').value,
                    telefono: document.getElementById('telefono').value,
                    provincia: document.getElementById('provincia').value,
                    ciudad: document.getElementById('ciudad').value,
                    direccion: document.getElementById('direccion').value,
                    solicitaEnvio: document.getElementById('envio').value,
                },
                productos: productosParaGuardar,
                total: parseFloat(document.getElementById('resumen-total').textContent.replace('$', '')),
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection("ordenes").add(orden);
                
                mensajeExitoso.textContent = "¡Pago realizado con éxito! Gracias por tu compra.";
                mensajeExitoso.style.color = 'green';
                
                setTimeout(() => {
                    formularioFacturacion.reset();
                    document.querySelectorAll('.input-formulario').forEach(input => {
                        input.classList.remove("border-green-500", "border-red-500");
                    });
                    window.guardarCarrito([]);
                    renderizarCarrito();
                    mensajeExitoso.classList.remove('visible');
                    botonPagar.disabled = false;
                }, 5000);

            } catch (error) {
                console.error("Error al guardar la orden: ", error);
                mensajeExitoso.textContent = "Error al procesar la orden. Inténtelo de nuevo.";
                mensajeExitoso.style.color = 'red';
                botonPagar.disabled = false;
            }
        });
    }

    renderizarCarrito();
});