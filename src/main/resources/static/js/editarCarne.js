document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Obtener datos de la sesión
        const response = await fetch('/carne/obtenerCarneDeSesion', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener los datos para editar');
        }

        const carne = await response.json();
        cargarDatosFormulario(carne);

        // Configurar envío del formulario
        document.getElementById('formularioEditarCarne').addEventListener('submit', guardarCambios);

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        window.location.href = 'gestionCarnes.html';
    }
});

function cargarDatosFormulario(carne) {
    document.getElementById('id').value = carne.id;
    document.getElementById('nombre').value = carne.nombre;
    document.getElementById('tipoCarne').value = carne.tipoCarne;
    document.getElementById('tipoCorte').value = carne.tipoCorte;
    document.getElementById('eurosPorKilo').value = carne.eurosPorKilo;
    document.getElementById('descripcion').value = carne.descripcion || '';
}

async function guardarCambios(event) {
    event.preventDefault();

    const carneActualizada = {
        id: document.getElementById('id').value,
        nombre: document.getElementById('nombre').value,
        tipoCarne: document.getElementById('tipoCarne').value,
        tipoCorte: document.getElementById('tipoCorte').value,
        eurosPorKilo: parseFloat(document.getElementById('eurosPorKilo').value),
        descripcion: document.getElementById('descripcion').value
    };

    try {
        const response = await fetch('/administracion/carnes/carne', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(carneActualizada)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar cambios');
        }

        alert('Cambios guardados correctamente');
        window.location.href = 'gestorProductos.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// Función para cancelar la edición
function cancelarEdicion() {
    // Verificar si hay cambios no guardados
    const formulario = document.getElementById('formularioEditarCarne');
    const inputs = formulario.querySelectorAll('input, select, textarea');
    let hayCambios = false;

    inputs.forEach(input => {
        if (input.defaultValue !== input.value) {
            hayCambios = true;
        }
    });

    if (hayCambios) {
        if (confirm('¿Estás seguro de que deseas cancelar? Tienes cambios sin guardar que se perderán.')) {
            window.location.href = 'gestorProductos.html';
        }
    } else {
        window.location.href = 'gestorProductos.html';
    }
}