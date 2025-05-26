document.addEventListener("DOMContentLoaded", function () {
    verificarSesionYPermisos();
});

function verificarSesionYPermisos() {
    fetch('/usuario/comprobarsesion', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            alert("No estás autenticado. Redirigiendo a login...");
            window.location.href = '/index.html';
            throw new Error('No autenticado');
        }
        return response.json();
    })
    .then(data => {
        if (data.tipo !== 'admin') {
            alert("No tienes permisos de administrador");
            window.location.href = '/index.html';
            throw new Error('No autorizado');
        }
        cargarPedidos();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function cargarPedidos() {
    fetch('/pedidos/dto')  // ✅ Usamos el DTO
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener pedidos: ' + response.status);
        return response.json();
    })
    .then(pedidos => {
        renderizarPedidos(pedidos);
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

function renderizarPedidos(pedidos) {
    const tabla = document.getElementById('tablaPedidos').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';

    pedidos.forEach(pedido => {
        const fila = document.createElement('tr');
        fila.id = `pedido-${pedido.id}`;

        const fechaPedido = new Date(pedido.fechaPedido).toLocaleDateString();
        const fechaEntrega = new Date(pedido.fechaEntrega).toLocaleDateString();

        fila.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.nombreUsuario}</td>
            <td>${fechaPedido}</td>
            <td>${fechaEntrega}</td>
            <td>${pedido.total.toFixed(2)} €</td>
            <td>${pedido.entregado ? 'Sí' : 'No'}</td>
            <td>${pedido.pagado ? 'Sí' : 'No'}</td>
            <td>
                <button onclick="verDetalles(${pedido.id})">Ver Detalles</button>
                <button onclick="cambiarEstadoEntrega(${pedido.id}, ${!pedido.entregado})">
                    ${pedido.entregado ? 'Marcar No Entregado' : 'Marcar Entregado'}
                </button>
                <button onclick="eliminarPedido(${pedido.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

async function cambiarEstadoEntrega(id, nuevoEstado) {
    try {
        const response = await fetch(`/pedidos/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Error al obtener pedido');

        const pedido = await response.json();
        pedido.entregado = nuevoEstado;

        const updateResponse = await fetch(`/pedidos/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!updateResponse.ok) throw new Error('Error al actualizar pedido');

        cargarPedidos(); // Recargar la tabla
        alert(`Estado de entrega actualizado para el pedido ${id}`);

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function eliminarPedido(id) {
    if (!confirm(`¿Estás seguro de eliminar el pedido ${id}? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        // Obtener el botón y deshabilitarlo durante la operación
        const botones = document.querySelectorAll(`button[onclick="eliminarPedido(${id})"]`);
        botones.forEach(boton => {
            boton.disabled = true;
            boton.textContent = 'Eliminando...';
            boton.style.opacity = '0.7';
        });

        const response = await fetch(`/pedidos/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el pedido');
        }

        // Eliminar visualmente la fila de la tabla
        const fila = document.getElementById(`pedido-${id}`);
        if (fila) {
            fila.classList.add('fila-eliminada');
            setTimeout(() => fila.remove(), 500);
        }

        // Mostrar notificación de éxito
        mostrarNotificacion(`Pedido ${id} eliminado correctamente`, 'success');
        
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        mostrarNotificacion(error.message, 'error');
        cargarPedidos(); // Recargar la tabla para asegurar consistencia
    }
}

// Función auxiliar para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

function verDetalles(id) {
    sessionStorage.setItem('pedidoId', id);
    window.location.href = 'detallesPedido.html';
}

function cerrarSesion() {
    fetch('/usuario/cerrarSesion', {
        method: 'POST',
        credentials: 'include'
    })
    .then(() => {
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
