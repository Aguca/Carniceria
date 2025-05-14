document.addEventListener("DOMContentLoaded", function() {
    const mandar = "";

    //Obtenemos el usuario de la sesion

    fetch(`/usuario/obtenerUsuarioSesion1`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(usuario => {
            if (usuario) {
                document.getElementById(`id`).value = usuario.id;
                document.getElementById('nombre').value = usuario.nombre;
                document.getElementById('apellido').value = usuario.apellido;
                document.getElementById('email').value = usuario.email;
                document.getElementById('telefono').value = usuario.telefono;
                document.getElementById('calle').value = usuario.calle;
                document.getElementById('dni').value = usuario.dni;
                document.getElementById(`contrasena`).value = usuario.contrasena;
            }
        })
        .catch(error => {
            console.log(error);
        })

    //Actualizacion del usuario

    const form = document.getElementById("formularioActualizarUsuario");
    form.addEventListener("submit", function (e){
        e.preventDefault();

        //Recoger los datos del formulario
        const id = document.getElementById("id").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const calle = document.getElementById("calle").value;
        const dni = document.getElementById("dni").value;
        const tipo = "normal";
        const contrasena = document.getElementById("contrasena").value;

        //Creamos in objeto con los datos del formlario

        const usuarioActualizado = {
            id,
            nombre,
            apellido,
            email,
            tipo,
            telefono,
            calle,
            dni,
            contrasena
        };

        console.log(email);

        //Actualizamos el servidor

        fetch(`administracion/actualizado/usuario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(usuarioActualizado)
        })

        //TODO: SesionInvalidate
            .then(response => {
                if (response.ok) {
                    alert("Usuario actualizado correctamente");
                    window.location.href = "administrador.html";
                } else {
                    alert("Hubo un error al actualizar los datos.")
                }
            })
    });
});
