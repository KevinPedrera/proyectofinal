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

window.actualizarNotificacionCarrito = async () => {
    const notificacionCarrito = document.getElementById('notificacion-carrito');
    if (!notificacionCarrito) return;

    try {
        const productos = await db.collection("carrito").get();
        let totalItems = 0;
        productos.forEach(doc => {
            totalItems += doc.data().cantidad;
        });

        if (totalItems > 0) {
            notificacionCarrito.textContent = totalItems;
            notificacionCarrito.style.display = 'flex';
        } else {
            notificacionCarrito.style.display = 'none';
        }
    } catch (error) {
        console.error("Error al actualizar la notificación", error);
        notificacionCarrito.style.display = 'none';
    }
};

window.agregarAlCarrito = async (id, nombre, precio, imagen) => {
    try {
        const productoQuery = await db.collection("carrito").where("id", "==", id).get();

        if (productoQuery.empty) {
            await db.collection("carrito").add({
                id: id,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        } else {
            const doc = productoQuery.docs[0];
            const nuevaCantidad = doc.data().cantidad + 1;
            await db.collection("carrito").doc(doc.id).update({ cantidad: nuevaCantidad });
        }
        
        alert(`"${nombre}" ha sido añadido al carrito.`);
        window.actualizarNotificacionCarrito();

    } catch (error) {
        console.error("No se puede agregar producto", error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.actualizarNotificacionCarrito();
});