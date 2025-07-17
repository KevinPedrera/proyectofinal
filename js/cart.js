window.obtenerCarrito = () => {
    const carritoString = sessionStorage.getItem('carritoDeCompras');
    return carritoString ? JSON.parse(carritoString) : [];
};

window.guardarCarrito = (carrito) => {
    sessionStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    window.dispatchEvent(new CustomEvent('carritoActualizado'));
};

window.agregarAlCarrito = (id, nombre, precio, imagen) => {
    const carrito = window.obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    window.guardarCarrito(carrito);
    alert(`"${nombre}" ha sido añadido al carrito.`);
};

const actualizarNotificacionCarrito = () => {
    const carrito = window.obtenerCarrito();
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const notificacionCarrito = document.getElementById('notificacion-carrito');

    if (notificacionCarrito) {
        if (totalItems > 0) {
            notificacionCarrito.textContent = totalItems;
            notificacionCarrito.style.display = 'flex';
        } else {
            notificacionCarrito.style.display = 'none';
        }
    }
};

window.addEventListener('carritoActualizado', actualizarNotificacionCarrito);

document.addEventListener('DOMContentLoaded', () => {
    actualizarNotificacionCarrito();
});