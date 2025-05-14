document.getElementById('registroFrom').addEventListener('submit', function (event) {

    event.preventDefault();

    //Obtener los valores del formulario

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const  email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const calle = document.getElementById('calle').value;
    const telefono = document.getElementById('telefono').value;
    const dni = document.getElementById('dni').value;

    fetch('formularioRegistro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            email: email,
            contrasena: contrasena,
            calle: calle,
            telefono: telefono,
            dni: dni
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.respuesta) {
                window.location.href = "/index.html"
            } else {
                document.getElementById('erroreMessage').innerText = "El registro no es válido"
            }
        })
        .catch(error => {
            document.getElementById('errorMessage').innerText="Hubo un error al procesar la solicitud.";
        })
})