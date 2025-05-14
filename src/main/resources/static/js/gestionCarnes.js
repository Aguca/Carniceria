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
            // Obtener las carnes
            cargarCarnes();
        })
        .catch(error => {
            console.error("Error al verificar sesión:", error);
        });
});

function cargarCarnes() {
    fetch('/administracion/carnes')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener carnes');
            return response.json();
        })
        .then(carnes => {
            const tabla = document.getElementById('tablaCarnes').getElementsByTagName('tbody')[0];
            tabla.innerHTML = ''; // Limpiar tabla

            carnes.forEach(carne => {
                const fila = document.createElement('tr');
                fila.id = `fila-carne-${carne.id}`;
                fila.innerHTML = `
                <td>${carne.id}</td>
                <td>${carne.nombre}</td>
                <td>${carne.tipoCarne}</td>
                <td>${carne.tipoCorte}</td>
                <td>${carne.eurosPorKilo}</td>
                <td>${carne.descripcion || '-'}</td>
                <td>
                    <button onclick="actualizarCarne(${carne.id})">Editar</button>
                    <button onclick="eliminarCarne(${carne.id})">Eliminar</button>
                </td>
            `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar carnes:', error);
            alert('Error al cargar la lista de carnes');
        });
}

async function eliminarCarne(id) {
    try {
        if (!confirm(`¿Estás seguro de eliminar esta carne (ID: ${id})?`)) {
            return;
        }

        const boton = document.querySelector(`button[onclick="eliminarCarne(${id})"]`);
        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = 'Eliminando...';

        const response = await fetch(`/administracion/carnes/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar carne');
        }

        const fila = document.getElementById(`fila-carne-${id}`);
        if (fila) {
            fila.remove();
        } else {
            cargarCarnes(); // Recargar si no encontramos la fila
        }
    } catch (error) {
        console.error('Error eliminando carne:', error);
        alert(error.message || 'Error al eliminar carne');
    } finally {
        const boton = document.querySelector(`button[onclick="eliminarCarne(${id})"]`);
        if (boton) {
            boton.disabled = false;
            boton.textContent = 'Eliminar';
        }
    }
}

function actualizarCarne(id) {
    fetch(`/administracion/carnes/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener carne');
            return response.json();
        })
        .then(carne => {
            return fetch('/carne/guardarCarne', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carne)
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al guardar en sesión');
            window.location.href = "editarCarne.html";
        })
        .catch(error => {
            console.error('Error al preparar edición:', error);
            alert('Error al preparar la edición de la carne');
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