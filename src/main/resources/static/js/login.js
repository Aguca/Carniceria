document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            email:email,
            password:password
        })
    })

        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error ("Credenciales incorrectas")
            }
            return response.json();
        })
        .then (data => {
            if (data) {
                console.log(data);
                if (data.tipo === "normal") {
                    window.location.href = "/usuario.html"
                } else {
                    window.location.href = "/administrador.html"
                }
            }
        })
        .catch(error => {
            console.log(error);
            document.getElementById('errorMessage').innerText = "Hubo un error en la solicitud";
        });
});