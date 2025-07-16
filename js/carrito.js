document.addEventListener('DOMContentLoaded', () => {
    const contenedorItems = document.getElementById('contenedor-items');
    const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
    const resumenSubtotal = document.getElementById('resumen-subtotal');
    const resumenTotal = document.getElementById('resumen-total');
    const resumenCarrito = document.getElementById('resumen-carrito');
    const formularioFacturacion = document.getElementById('formulario-facturacion');
    const botonPagar = document.getElementById('boton-pagar');
    const mensajeEnvioExitoso = document.getElementById('mensaje-envio-exitoso');

    const inputNombre = document.getElementById('nombre');
    const inputCedula = document.getElementById('cedula');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputProvincia = document.getElementById('provincia');
    const inputCiudad = document.getElementById('ciudad');
    const inputDireccion = document.getElementById('direccion');
    const inputContrasena = document.getElementById('contrasena');

    const errorNombre = document.getElementById('error-nombre');
    const errorCedula = document.getElementById('error-cedula');
    const errorEmail = document.getElementById('error-email');
    const errorTelefono = document.getElementById('error-telefono');
    const errorProvincia = document.getElementById('error-provincia');
    const errorCiudad = document.getElementById('error-ciudad');
    const errorDireccion = document.getElementById('error-direccion');
    const errorContrasena = document.getElementById('error-contrasena');

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
            if (objetivo.matches('.btn-cantidad')) {
                const cambio = parseInt(objetivo.dataset.cambio, 10);
                const item = carrito.find(i => i.id === itemId);
                if (item) {
                    item.cantidad += cambio;
                    if (item.cantidad === 0) carrito.splice(carrito.findIndex(i => i.id === itemId), 1);
                }
            } else {
                const itemIndex = carrito.findIndex(i => i.id === itemId);
                if (itemIndex > -1) carrito.splice(itemIndex, 1);
            }
            window.guardarCarrito(carrito);
            renderizarCarrito();
        }
    });
    
    const validarNombre = () => {
        const nombre = inputNombre.value.trim();
        if (nombre === "") {
            errorNombre.textContent = "El nombre es obligatorio";
            inputNombre.classList.add('border-red-500');
            inputNombre.classList.remove('border-green-500');
            return false;
        }
        errorNombre.textContent = "";
        inputNombre.classList.add('border-green-500');
        inputNombre.classList.remove('border-red-500');
        return true;
    };
    const validarCedula = () => {
        const cedula = inputCedula.value.trim();
        const regex = /^[0-9]{10,13}$/;
        if (!regex.test(cedula)) {
            errorCedula.textContent = "Debe tener 10 o 13 dígitos";
            inputCedula.classList.add('border-red-500');
            inputCedula.classList.remove('border-green-500');
            return false;
        }
        errorCedula.textContent = "";
        inputCedula.classList.add('border-green-500');
        inputCedula.classList.remove('border-red-500');
        return true;
    };
    const validarEmail = () => {
        const email = inputEmail.value.trim();
        const regexEmail = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(email)) {
            errorEmail.textContent = "Ingrese un correo válido";
            inputEmail.classList.add('border-red-500');
            inputEmail.classList.remove('border-green-500');
            return false;
        }
        errorEmail.textContent = "";
        inputEmail.classList.add('border-green-500');
        inputEmail.classList.remove('border-red-500');
        return true;
    };
    const validarTelefono = () => {
        const telefono = inputTelefono.value.trim();
        const regex = /^[0-9]{9,10}$/;
        if (!regex.test(telefono)) {
            errorTelefono.textContent = "Debe tener 9 o 10 dígitos";
            inputTelefono.classList.add('border-red-500');
            inputTelefono.classList.remove('border-green-500');
            return false;
        }
        errorTelefono.textContent = "";
        inputTelefono.classList.add('border-green-500');
        inputTelefono.classList.remove('border-red-500');
        return true;
    };
    const validarProvincia = () => {
        if (inputProvincia.value.trim() === "") {
            errorProvincia.textContent = "La provincia es obligatoria";
            inputProvincia.classList.add('border-red-500');
            inputProvincia.classList.remove('border-green-500');
            return false;
        }
        errorProvincia.textContent = "";
        inputProvincia.classList.add('border-green-500');
        inputProvincia.classList.remove('border-red-500');
        return true;
    };
    const validarCiudad = () => {
        if (inputCiudad.value.trim() === "") {
            errorCiudad.textContent = "La ciudad es obligatoria";
            inputCiudad.classList.add('border-red-500');
            inputCiudad.classList.remove('border-green-500');
            return false;
        }
        errorCiudad.textContent = "";
        inputCiudad.classList.add('border-green-500');
        inputCiudad.classList.remove('border-red-500');
        return true;
    };
    const validarDireccion = () => {
        if (inputDireccion.value.trim().length < 10) {
            errorDireccion.textContent = "Debe tener al menos 10 caracteres";
            inputDireccion.classList.add('border-red-500');
            inputDireccion.classList.remove('border-green-500');
            return false;
        }
        errorDireccion.textContent = "";
        inputDireccion.classList.add('border-green-500');
        inputDireccion.classList.remove('border-red-500');
        return true;
    };
    const validarContrasena = () => {
        const contrasena = inputContrasena.value.trim();
        const regexContrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!regexContrasena.test(contrasena)) {
            errorContrasena.textContent = "Mínimo 8 caracteres, una letra y un número";
            inputContrasena.classList.add('border-red-500');
            inputContrasena.classList.remove('border-green-500');
            return false;
        }
        errorContrasena.textContent = "";
        inputContrasena.classList.add('border-green-500');
        inputContrasena.classList.remove('border-red-500');
        return true;
    };
    const validarFormularioCompleto = () => {
        const esValido = validarNombre() && validarCedula() && validarEmail() && validarTelefono() &&
                         validarProvincia() && validarCiudad() && validarDireccion() && validarContrasena();
        botonPagar.disabled = !esValido;
    };

    inputNombre.addEventListener('input', validarFormularioCompleto);
    inputCedula.addEventListener('input', validarFormularioCompleto);
    inputEmail.addEventListener('input', validarFormularioCompleto);
    inputTelefono.addEventListener('input', validarFormularioCompleto);
    inputProvincia.addEventListener('input', validarFormularioCompleto);
    inputCiudad.addEventListener('input', validarFormularioCompleto);
    inputDireccion.addEventListener('input', validarFormularioCompleto);
    inputContrasena.addEventListener('input', validarFormularioCompleto);

    const enviarFormulario = async () => {
        if (botonPagar.disabled) return;
        botonPagar.disabled = true;
        mensajeEnvioExitoso.textContent = "Procesando pago... (Esto es una simulación)";
        mensajeEnvioExitoso.style.color = 'blue';
        await new Promise(resolve => setTimeout(resolve, 2000));
        mensajeEnvioExitoso.textContent = "¡Pago procesado con éxito! Gracias por tu compra.";
        mensajeEnvioExitoso.style.color = 'green';
        setTimeout(() => {
            formularioFacturacion.reset();
            document.querySelectorAll('.input-formulario').forEach(input => {
                input.classList.remove("border-green-500", "border-red-500");
            });
            document.querySelectorAll('.mensaje-error').forEach(error => error.textContent = "");
            mensajeEnvioExitoso.textContent = "";
            window.guardarCarrito([]); 
            renderizarCarrito();
        }, 3000);
    };

    formularioFacturacion.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarFormulario();
    });

    renderizarCarrito();
});