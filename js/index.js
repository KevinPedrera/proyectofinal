document.addEventListener('DOMContentLoaded', () => {
    const botonMenu = document.getElementById('boton-menu');
    const menuMovil = document.getElementById('menu-movil');

    if (botonMenu && menuMovil) {
        botonMenu.addEventListener('click', () => {
            menuMovil.classList.toggle('open');
        });
    }
});