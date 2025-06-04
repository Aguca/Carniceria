document.addEventListener("DOMContentLoaded", function () {
    // Verificar sesión y permisos
    fetch('/usuario/comprobarsesion', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                alert("No estás autenticado. Redirigiendo a login...");
                window.location.href = '/index.html';
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.tipo !== 'admin') {
                alert("No eres administrador. No puedes acceder a esta página");
                window.location.href = '/index.html';
                return;
            }
            // Obtener los proveedores
            cargarProveedores();
        })
        .catch(error => {
            console.error("Error al verificar sesión:", error);
        });
});

function cargarProveedores() {
    fetch('/proveedores')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener proveedores');
            return response.json();
        })
        .then(proveedores => {
            const tabla = document.getElementById('tablaProveedores').getElementsByTagName('tbody')[0];
            tabla.innerHTML = ''; // Limpiar tabla

            proveedores.forEach(proveedor => {
                const fila = document.createElement('tr');
                fila.id = `fila-proveedor-${proveedor.id}`;
                fila.innerHTML = `
                    <td>${proveedor.id}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.telefono}</td>
                    <td class="${proveedor.activo ? 'estado-activo' : 'estado-inactivo'}">
                        ${proveedor.activo ? 'Activo' : 'Inactivo'}
                    </td>
                    <td>
                        <button onclick="editarProveedor(${proveedor.id})">Editar</button>
                        <button onclick="eliminarProveedor(${proveedor.id})">Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar proveedores:', error);
            alert('Error al cargar la lista de proveedores');
        });
}

async function eliminarProveedor(id) {
    try {
        if (!confirm(`¿Estás seguro de eliminar este proveedor (ID: ${id})?`)) {
            return;
        }

        const boton = document.querySelector(`button[onclick="eliminarProveedor(${id})"]`);
        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = 'Eliminando...';

        const response = await fetch(`/proveedores/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar proveedor');
        }

        const fila = document.getElementById(`fila-proveedor-${id}`);
        if (fila) {
            fila.remove();
        } else {
            cargarProveedores(); // Recargar si no encontramos la fila
        }
    } catch (error) {
        console.error('Error eliminando proveedor:', error);
        alert(error.message || 'Error al eliminar proveedor');
    } finally {
        const boton = document.querySelector(`button[onclick="eliminarProveedor(${id})"]`);
        if (boton) {
            boton.disabled = false;
            boton.textContent = 'Eliminar';
        }
    }
}

function editarProveedor(id) {
    fetch(`/proveedores/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener proveedor');
            return response.json();
        })
        .then(proveedor => {
            // Guardar el proveedor en localStorage para recuperarlo en la página de edición
            localStorage.setItem('proveedorEditar', JSON.stringify(proveedor));
            window.location.href = "editarProveedor.html";
        })
        .catch(error => {
            console.error('Error al preparar edición:', error);
            alert('Error al preparar la edición del proveedor');
        });
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
            console.error('Error al cerrar sesión:', error);
        });
}