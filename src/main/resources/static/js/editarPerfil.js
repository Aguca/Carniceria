document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del usuario de la sesión
    fetch('/usuario/obtenerUsuarioSesion', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }
            return response.json();
        })
        .then(usuario => {
            if (usuario) {
                document.getElementById('id').value = usuario.id;
                document.getElementById('nombre').value = usuario.nombre;
                document.getElementById('apellido').value = usuario.apellido;
                document.getElementById('email').value = usuario.email;
                document.getElementById('telefono').value = usuario.telefono;
                document.getElementById('calle').value = usuario.calle;
                document.getElementById('dni').value = usuario.dni;
                document.getElementById('contrasena').value = usuario.contrasena;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los datos del perfil');
        });

    // Manejar envío del formulario
    const form = document.getElementById("formularioEditarPerfil");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuarioActualizado = {
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            calle: document.getElementById("calle").value,
            dni: document.getElementById("dni").value,
            contrasena: document.getElementById("contrasena").value,
            tipo: "normal" // Asegura que se mantenga el tipo si es necesario
        };

        fetch('/editarUsuario/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(usuarioActualizado)
        })
            .then(response => {
                if (response.ok) {
                    alert("Perfil actualizado correctamente");
                    window.location.href = "perfil.html";
                } else {
                    return response.text().then(text => { throw new Error(text); });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Hubo un error al actualizar el perfil: " + error.message);
            });
    });
});
