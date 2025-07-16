document.addEventListener('DOMContentLoaded', () => {
    const barraBusqueda = document.getElementById('barra-busqueda');
    const listaProductos = document.getElementById('lista-productos');
    const productos = Array.from(listaProductos.children);
    const filtrosCategoria = document.getElementById('filtros-categoria');
    const botonesFiltro = filtrosCategoria.querySelectorAll('.btn-filtro');
    const mensajeSinResultados = document.getElementById('mensaje-sin-resultados');

    let categoriaActiva = 'all';

    function filtrarProductos() {
        const consultaBusqueda = barraBusqueda.value.toLowerCase().trim();
        let productosEncontrados = false;

        productos.forEach(producto => {
            const titulo = producto.querySelector('.titulo-producto').textContent.toLowerCase();
            const categoria = producto.getAttribute('data-category');
            const coincideBusqueda = titulo.includes(consultaBusqueda);
            const coincideCategoria = (categoriaActiva === 'all' || categoria === categoriaActiva);

            if (coincideBusqueda && coincideCategoria) {
                producto.style.display = 'flex';
                productosEncontrados = true;
            } else {
                producto.style.display = 'none';
            }
        });

        mensajeSinResultados.style.display = productosEncontrados ? 'none' : 'block';
    }

    barraBusqueda.addEventListener('input', filtrarProductos);
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            categoriaActiva = boton.getAttribute('data-category');
            filtrarProductos();
        });
    });

    const modalProducto = document.getElementById('modal-producto');
    const botonCerrarModal = document.getElementById('cerrar-modal');
    const modalImagen = document.getElementById('modal-imagen');
    const modalNombre = document.getElementById('modal-nombre');
    const modalPrecio = document.getElementById('modal-precio');
    const modalDetalles = document.getElementById('modal-detalles');
    const modalBotonAñadir = document.getElementById('modal-boton-añadir');

    listaProductos.addEventListener('click', (e) => {
        const botonDetalles = e.target.closest('.btn-detalles');
        const botonAñadir = e.target.closest('.btn-añadir-carrito');
        const tarjeta = e.target.closest('.tarjeta-producto');

        if (!tarjeta) return;

        if (botonDetalles) {
            const nombre = tarjeta.dataset.name;
            const precio = tarjeta.dataset.price;
            const imagen = tarjeta.dataset.image;
            const detalles = tarjeta.dataset.details;

            modalImagen.src = imagen;
            modalNombre.textContent = nombre;
            modalPrecio.textContent = `$${precio}`;
            modalDetalles.textContent = detalles;
            
            modalBotonAñadir.onclick = () => {
                window.agregarAlCarrito(tarjeta.dataset.id, nombre, parseFloat(precio), imagen);
            };

            modalProducto.classList.remove('hidden');
        }
        
        if (botonAñadir && !e.target.closest('.contenedor-modal')) {
             window.agregarAlCarrito(
                tarjeta.dataset.id, 
                tarjeta.dataset.name, 
                parseFloat(tarjeta.dataset.price), 
                tarjeta.dataset.image
            );
        }
    });

    botonCerrarModal.addEventListener('click', () => {
        modalProducto.classList.add('hidden');
    });

    modalProducto.addEventListener('click', (e) => {
        if (e.target === modalProducto) {
            modalProducto.classList.add('hidden');
        }
    });
});