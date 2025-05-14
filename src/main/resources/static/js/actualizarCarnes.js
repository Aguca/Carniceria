document.addEventListener("DOMContentLoaded", function() {
    // Obtener los datos de la carne desde la sesión
    fetch('/carne/obtenerCarneDeSesion', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la carne');
            }
            return response.json();
        })
        .then(carne => {
            // Rellenar el formulario con los datos
            document.getElementById('id').value = carne.id;
            document.getElementById('nombre').value = carne.nombre;
            document.getElementById('tipoCarne').value = carne.tipoCarne;
            document.getElementById('tipoCorte').value = carne.tipoCorte;
            document.getElementById('eurosPorKilo').value = carne.eurosPorKilo;
            document.getElementById('descripcion').value = carne.descripcion || '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
            window.location.href = 'gestionCarnes.html';
        });

    // Manejar el envío del formulario
    document.getElementById('formularioEditarCarne').addEventListener('submit', function(e) {
        e.preventDefault();

        const carneActualizada = {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            tipoCarne: document.getElementById('tipoCarne').value,
            tipoCorte: document.getElementById('tipoCorte').value,
            eurosPorKilo: parseFloat(document.getElementById('eurosPorKilo').value),
            descripcion: document.getElementById('descripcion').value
        };

        // Enviar los datos actualizados al servidor
        fetch('/administracion/carnes/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(carneActualizada)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar la carne');
                }
                return response.json();
            })
            .then(() => {
                alert('Carne actualizada correctamente');
                window.location.href = 'gestionCarnes.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });
});

function cancelarEdicion() {
    if (confirm('¿Estás seguro de que deseas cancelar los cambios?')) {
        window.location.href = 'gestionCarnes.html';
    }
}