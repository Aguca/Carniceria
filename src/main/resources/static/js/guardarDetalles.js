document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const nombreCarneElement = document.getElementById('nombre-carne');
    const tipoCarneElement = document.getElementById('tipo-carne');
    const corteCarneElement = document.getElementById('corte-carne');
    const precioKiloElement = document.getElementById('precio-kilo');
    const descripcionElement = document.getElementById('descripcion');
    const cantidadInput = document.getElementById('cantidad');
    const precioTotalSpan = document.getElementById('precio-total');
    const anadirCarritoBtn = document.getElementById('anadirCarrito');

    // Variables para almacenar la información de la carne
    let carneActual = null;
    let precioPorKg = 0;

    // Función para cargar la información de la carne desde localStorage y backend
    async function cargarCarne() {
        try {
            // Obtener el ID de localStorage
            const idCarne = localStorage.getItem('id_detalles_carne');
            
            if (!idCarne) {
                throw new Error('No se encontró ID de carne en localStorage');
            }
            
            // Obtener los detalles de la carne desde el backend
            const response = await fetch(`/carne/obtenerPorId/${idCarne}`);
            
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la carne');
            }
            
            carneActual = await response.json();
            mostrarInformacionCarne(carneActual);
            
            // Guardar también en localStorage por si acaso
            localStorage.setItem('carne_actual', JSON.stringify(carneActual));
            
        } catch (error) {
            console.error('Error al cargar la carne:', error);
            
            // Intentar recuperar de localStorage como fallback
            const carneLocal = JSON.parse(localStorage.getItem('carne_actual'));
            if (carneLocal) {
                carneActual = carneLocal;
                mostrarInformacionCarne(carneActual);
            } else {
                mostrarInformacionPorDefecto();
            }
        }
    }

    // Función para mostrar la información de la carne
    function mostrarInformacionCarne(carne) {
        nombreCarneElement.textContent = carne.nombre;
        tipoCarneElement.textContent = `Tipo de carne: ${carne.tipoCarne}`;
        corteCarneElement.textContent = `Corte: ${carne.tipoCorte}`;
        precioKiloElement.textContent = `Precio por kilo: €${(carne.eurosPorKilo / 100).toFixed(2)}`;
        descripcionElement.textContent = carne.descripcion || 'Sin descripción';
        precioPorKg = carne.eurosPorKilo / 100; // Convertir a euros
    }

    // Función para mostrar información por defecto si hay error
    function mostrarInformacionPorDefecto() {
        nombreCarneElement.textContent = 'Carne de Res';
        tipoCarneElement.textContent = 'Tipo de carne: Vacuno';
        corteCarneElement.textContent = 'Corte: Lomo';
        precioKiloElement.textContent = 'Precio por kilo: €12.99';
        descripcionElement.textContent = 'Carne de res premium';
        precioPorKg = 12.99;
    }

    // Función para calcular y mostrar el precio total
    function calcularPrecio() {
        const cantidad = parseFloat(cantidadInput.value);
        
        if (cantidad > 0) {
            const precioTotal = cantidad * precioPorKg;
            precioTotalSpan.textContent = `€${precioTotal.toFixed(2)}`;
        } else {
            precioTotalSpan.textContent = "€0.00";
        }
    }

    // Función para añadir al carrito
    function anadirAlCarrito() {
        const cantidad = parseFloat(cantidadInput.value);
        
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor ingrese una cantidad válida');
            return;
        }

        if (!carneActual) {
            alert('No hay información de carne disponible');
            return;
        }

        const itemCarrito = {
            id: carneActual.id,
            nombre: carneActual.nombre,
            tipoCarne: carneActual.tipoCarne,
            tipoCorte: carneActual.tipoCorte,
            cantidad: cantidad,
            precioPorKg: precioPorKg,
            precioTotal: cantidad * precioPorKg,
            descripcion: carneActual.descripcion || ''
        };

        // Obtener carrito existente o crear uno nuevo
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Añadir nuevo item al carrito
        carrito.push(itemCarrito);
        
        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        alert('Producto añadido al carrito correctamente');
    }

    // Event listeners
    cantidadInput.addEventListener('input', calcularPrecio);
    anadirCarritoBtn.addEventListener('click', anadirAlCarrito);

    // Cargar la información al iniciar
    cargarCarne();
});