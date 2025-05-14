document.addEventListener("DOMContentLoaded", function() {
    console.log("1. Script cargado correctamente");

    const tipoCarne = localStorage.getItem('carneElegida');
    console.log("2. Carne en localStorage:", tipoCarne);

    if (!tipoCarne) {
        console.log("3. No se encontró carne seleccionada");
        alert("No has seleccionado ningún tipo de carne. Redirigiendo...");
        window.location.href = '/seleccion-carne.html';
        return;
    }

    // 2. Mostrar el tipo seleccionado
    const titulo = document.getElementById('titulo-carne');
    if (!titulo) {
        console.error("4. No se encontró el elemento #titulo-carne");
        return;
    }
    titulo.textContent = `Carnes de tipo: ${tipoCarne}`;
    console.log("5. Título actualizado");

    // 3. Hacer fetch al endpoint
    console.log("6. Haciendo fetch...");
    fetch(`/carne/obtenerPorTipo/${tipoCarne}`)
        .then(response => {
            console.log("7. Respuesta recibida, status:", response.status);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(carnes => {
            console.log("8. Datos recibidos:", carnes);
            renderizarTabla(carnes);
        })
        .catch(error => {
            console.error("9. Error en fetch:", error);
            const tabla = document.getElementById('tablaCarnes');
            if (tabla) {
                tabla.innerHTML = `<tr><td colspan="7">Error al cargar: ${error.message}</td></tr>`;
            }
            alert("Error al cargar los datos. Ver consola para detalles.");
        });

    function renderizarTabla(carnes) {
        console.log("10. Renderizando tabla...");
        const tablaCarnes = document.getElementById('tablaCarnes');
        if (!tablaCarnes) {
            console.error("11. No se encontró #tablaCarnes");
            return;
        }

        tablaCarnes.innerHTML = '';
        console.log("12. Tabla limpiada");

        if (!carnes || carnes.length === 0) {
            console.log("13. No hay datos de carnes");
            tablaCarnes.innerHTML = '<tr><td colspan="7">No hay carnes disponibles</td></tr>';
            return;
        }

        console.log("14. Creando filas...");
        carnes.forEach(carne => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${carne.id}</td>
                <td>${carne.nombre}</td>
                <td>${carne.tipoCarne}</td>
                <td>${carne.tipoCorte}</td>
                <td>${carne.descripcion || 'Sin descripción'}</td>
                <td>${carne.eurosPorKilo} €/kg</td>
                <td>
                    <button class="btn-editar" data-id="${carne.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${carne.id}">Eliminar</button>
                </td>
            `;
            tablaCarnes.appendChild(fila);
        });

        console.log("15. Añadiendo event listeners...");
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log("Click en editar, ID:", btn.dataset.id);
                editarCarne(btn.dataset.id);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log("Click en eliminar, ID:", btn.dataset.id);
                eliminarCarne(btn.dataset.id);
            });
        });
    }
});

function editarCarne(id) {
    console.log("Iniciando edición para ID:", id);
    localStorage.setItem('carneAEditar', id);
    window.location.href = 'editar-carne.html';
}

function eliminarCarne(id) {
    console.log("Intentando eliminar ID:", id);
    if (!confirm(`¿Eliminar carne con ID ${id}?`)) {
        console.log("Eliminación cancelada");
        return;
    }

    console.log("Enviando solicitud DELETE...");
    fetch(`/carne/eliminar/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            console.log("Respuesta DELETE recibida, status:", response.status);
            if (!response.ok) throw new Error('Error en la respuesta');
            alert('Carne eliminada');
            location.reload();
        })
        .catch(error => {
            console.error("Error en DELETE:", error);
            alert('Error al eliminar');
        });
}