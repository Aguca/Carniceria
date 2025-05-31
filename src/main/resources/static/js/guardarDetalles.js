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

    // Función para cargar la información de la carne
    async function cargarCarne() {
        try {
            const idCarne = localStorage.getItem('id_detalles_carne');
            if (!idCarne) throw new Error('No se encontró ID de carne');
            
            const response = await fetch(`/carne/obtenerPorId/${idCarne}`);
            if (!response.ok) throw new Error('Error al obtener la carne');
            
            carneActual = await response.json();
            mostrarInformacionCarne(carneActual);
            localStorage.setItem('carne_actual', JSON.stringify(carneActual));
        } catch (error) {
            console.error('Error:', error);
            const carneLocal = JSON.parse(localStorage.getItem('carne_actual'));
            carneLocal ? mostrarInformacionCarne(carneLocal) : mostrarInformacionPorDefecto();
        }
    }

    // Mostrar información de la carne
    function mostrarInformacionCarne(carne) {
        nombreCarneElement.textContent = carne.nombre;
        tipoCarneElement.textContent = `Tipo: ${carne.tipoCarne}`;
        corteCarneElement.textContent = `Corte: ${carne.tipoCorte}`;
        precioKiloElement.textContent = `Precio/kg: €${(carne.eurosPorKilo / 100).toFixed(2)}`;
        descripcionElement.textContent = carne.descripcion || 'Sin descripción';
        precioPorKg = carne.eurosPorKilo / 100; // Convertir céntimos a euros
    }

    // Información por defecto
    function mostrarInformacionPorDefecto() {
        nombreCarneElement.textContent = 'Carne de Res';
        tipoCarneElement.textContent = 'Tipo: Vacuno';
        corteCarneElement.textContent = 'Corte: Lomo';
        precioKiloElement.textContent = 'Precio/kg: €12.99';
        descripcionElement.textContent = 'Carne premium seleccionada';
        precioPorKg = 12.99;
    }

    // Función para calcular el precio (corregido para comas decimales)
    function calcularPrecio() {
        const valor = cantidadInput.value.replace(',', '.'); // Convertir comas a puntos
        const cantidad = parseFloat(valor) || 0; // Si no es número, usa 0
        
        if (cantidad > 0) {
            const precioTotal = (cantidad * precioPorKg) * 100;
            precioTotalSpan.textContent = `€${precioTotal.toFixed(2)}`;
        } else {
            precioTotalSpan.textContent = "€0.00";
        }
    }

    // Añadir al carrito (versión corregida)
    function anadirAlCarrito() {
        const valor = cantidadInput.value.replace(',', '.');
        const cantidad = parseFloat(valor);

        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Ingrese una cantidad válida (ej: 1,5 o 1.5)');
            return;
        }

        if (!carneActual) {
            alert('Error: No hay información del producto');
            return;
        }

        const itemCarrito = {
            id: carneActual.id,
            nombre: carneActual.nombre,
            tipoCarne: carneActual.tipoCarne,
            tipoCorte: carneActual.tipoCorte,
            cantidad: cantidad,
            precioPorKg: precioPorKg,
            precioTotal: parseFloat((cantidad * precioPorKg).toFixed(2)), // Redondeo seguro
            descripcion: carneActual.descripcion || ''
        };

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(itemCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        alert(`${cantidad} kg de ${carneActual.nombre} añadidos al carrito`);
        window.location.href = '/paginaPrincipalTienda.html';
    }

    // Event Listeners
    cantidadInput.addEventListener('input', calcularPrecio);
    anadirCarritoBtn.addEventListener('click', anadirAlCarrito);

    // Inicialización
    cargarCarne();
});