document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('formAñadirCarne').addEventListener('submit', guardarNuevaCarne);
});

async function guardarNuevaCarne(event) {
    event.preventDefault();

    const nuevaCarne = {
        nombre: document.getElementById('nombre').value,
        tipoCarne: document.getElementById('tipoCarne').value,
        tipoCorte: document.getElementById('tipoCorte').value,
        eurosPorKilo: parseFloat(document.getElementById('precio').value),
        descripcion: document.getElementById('descripcion').value
    };

    try {
        const response = await fetch('/administracion/carnes/carne', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(nuevaCarne)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar la nueva carne');
        }

        alert('Carne añadida correctamente');
        window.location.href = 'GestorProductos.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al añadir carne: ' + error.message);
    }
}