document.addEventListener("DOMContentLoaded", function () {
    // Solicitud para verificar la sesión del usuario
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
        .then(data=> {
            if (data.tipo !== 'admin') {
                alert("No eres administrador. No puedes acceder a esta página");
                window.location.href = '/index.html';
                return;
            }
            //Obtenemos los usuarios
            fetch('/administracion/usuarios')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Recorremos la lista de usuarios y creamos una tabla con sus datos
                    data.forEach(usuario => {
                        const fila = document.createElement('tr');
                        fila.innerHTML =`
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre} ${usuario.apellido}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.activo ? "Activo" : "Inactivo"}</td>
                        <td>
                            <button onclick="actualizarUsuario(${usuario.id})">Actualizar</button>
                            <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </td>
                        `;
                        document.getElementById('tablaUsuarios').appendChild(fila);
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log("Error al verificar sesión:", error);
        });
});

// Eliminar un usuario
async function eliminarUsuario(id) {
    try {
        //Confirmación del usuario
        if (!confirm(`¿Estás seguro de eliminar al usuario ${id}?`)) {
            return;
        }

        //Mostrar feedback visual
        const boton = document.querySelector(`button[onclick="eliminarUsuario(${id})"]`);
        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = 'Eliminando...';

        //Hacer la petición
        const response = await fetch(`/administracion/usuarios/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Crucial para autenticación
            headers: {
                'Content-Type': 'application/json'
            }
        });

        //Verificar respuesta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar usuario');
        }

        //Actualizar UI
        const fila = document.getElementById(`fila-usuario-${id}`);
        if (fila) {
            fila.remove();
        } else {
            location.reload(); // Fallback si no encontramos la fila
        }

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert(error.message || 'Error al eliminar usuario');
    } finally {
        // Restaurar botón
        if (boton) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

// Obtener el usuario y mandarlo para crear una sesion
function actualizarUsuario(id) {
    fetch(`administracion/usuarios/${id}`)
.then(response => response.json())
        .then(data => {
            console.log(data);
            // Enviar los datos al servidor para almacenarlos en la sesión
            fetch('/usuario/guardarUsuario', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json;latin1'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        // Redirigir a la página de actualización
                        window.location.href = "actualizarOtroUsuario.html";
                    } else {
                        alert("Error al guardar en la sesión.");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
        });
}