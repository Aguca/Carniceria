document.addEventListener('DOMContentLoaded', function() {
    // Llamada al endpoint que devuelve todos los datos del usuario
    fetch('/usuario/obtenerUsuarioSesion', {
        credentials: 'include' // Necesario para mantener la sesión
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No hay sesión activa');
        }
        return response.json();
    })
    .then(usuario => {
        // Seleccionamos el elemento donde mostraremos el nombre
        const nombreUsuarioElement = document.getElementById('nombreUsuario');
        
        // Extraemos SOLO el nombre del objeto usuario
        if (usuario && usuario.nombre) {
            nombreUsuarioElement.textContent = usuario.nombre;
        } else {
            nombreUsuarioElement.textContent = 'Usuario';
        }
    })
    .catch(error => {
        console.error('Error al obtener usuario:', error);
        document.getElementById('nombreUsuario').textContent = 'Usuario';
    });
});