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

    // Mostrar el tipo seleccionado
    const titulo = document.getElementById('titulo-carne');
    if (!titulo) {
        console.error("4. No se encontró el elemento #titulo-carne");
        return;
    }
    titulo.textContent = `Carnes de tipo: ${tipoCarne}`;
    console.log("5. Título actualizado");

    // Hacer fetch al endpoint
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
                    <button class="btn-editar" 
                            data-id="${carne.id}"
                            data-carne='${JSON.stringify(carne)}'>
                        Ver detalles
                    </button>
                </td>
            `;
            tablaCarnes.appendChild(fila);
        });

        console.log("15. Añadiendo event listeners...");
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log("Click en ver detalles, ID:", btn.dataset.id);
                const carneData = JSON.parse(btn.dataset.carne);
                detallesCarne(btn.dataset.id, carneData);
            });
        });
    }

    function detallesCarne(id, carneSeleccionada) {
        console.log("16. Guardando ID para detalles:", id);
        localStorage.setItem('id_detalles_carne', id);
        
        if (carneSeleccionada) {
            // Guardar en la sesión del servidor
            fetch('/carne/guardarCarne', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carneSeleccionada)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al guardar en sesión');
                }
                return response.text();
            })
            .then(result => {
                console.log('Carne guardada en sesión:', result);
                window.location.href = 'vistaDetalleCarne.html';
            })
            .catch(error => {
                console.error('Error:', error);
                // Aun así redirigir aunque falle el guardado en sesión
                window.location.href = 'vistaDetalleCarne.html';
            });
        } else {
            console.error('No se encontró la carne con ID:', id);
            window.location.href = 'vistaDetalleCarne.html';
        }
    }
});