function cerrarSesion () {
    fetch('/usuario/cerrarSesion', {
        method:'GET',
        credentials:'include'
    })
        .then(response => {
            if (response.ok) {
                // Redirigir a la página de inicio de sesión
                window.location.href = 'index.html';
            } else {
                console.error('Error al cerrar sesión');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}