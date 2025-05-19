document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciar = document.getElementById('vaciar-carrito');

    // Función para cargar y mostrar el carrito
    function cargarCarrito() {
        // Obtener carrito de localStorage o array vacío si no existe
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Limpiar tabla
        cuerpoTabla.innerHTML = '';
        
        // Variables para calcular el total
        let total = 0;
        
        // Llenar la tabla con los productos del carrito
        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr');
            
            // Calcular subtotal
            const subtotal = (producto.cantidad * producto.precioPorKg)*100;
            total += subtotal;
            
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.tipoCarne}</td>
                <td>${producto.tipoCorte}</td>
                <td>${producto.cantidad.toFixed(2)}</td>
                <td>€${producto.precioPorKg.toFixed(2)}</td>
                <td>€${subtotal.toFixed(2)}</td>
                <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
            `;
            
            cuerpoTabla.appendChild(fila);
        });
        
        // Mostrar el total
        totalCarrito.textContent = `Total: €${total.toFixed(2)}`;
        
        // Mostrar mensaje si el carrito está vacío
        if (carrito.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tu carrito está vacío</td></tr>';
        }

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', eliminarProducto);
        });

        // Añadir event listeners a los botones de pago
        document.getElementById('efectivo').addEventListener('click', irAPagoEfectivo);	
        document.getElementById('tarjeta').addEventListener('click', irAPagoTarjeta);
        
    }

    // Función para eliminar un producto específico
    function eliminarProducto(e) {
        const index = e.target.dataset.index;
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (index >= 0 && index < carrito.length) {
            if (confirm('¿Eliminar este producto del carrito?')) {
                carrito.splice(index, 1); // Eliminar 1 elemento en la posición index
                localStorage.setItem('carrito', JSON.stringify(carrito));
                cargarCarrito(); // Recargar la tabla
            }
        }
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            localStorage.removeItem('carrito');
            cargarCarrito(); // Recargar para mostrar carrito vacío
        }
    }

    //Ir a pagina de pago en efectivo
    function irAPagoEfectivo() {
        window.location.href = '/pagoEfectivo.html';
    }

    //Ir a pagina de pago con tarjeta
    function irAPagoTarjeta() {
        window.location.href = '/pagoTarjeta.html';
    }


    // Event listeners
    btnVaciar.addEventListener('click', vaciarCarrito);
    

    // Cargar el carrito al iniciar
    cargarCarrito();
});