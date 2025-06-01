document.addEventListener('DOMContentLoaded', function() {
    // Configurar fechas
    const fechaHoyInput = document.getElementById('fecha-hoy');
    const fechaEntregaInput = document.getElementById('fecha-entrega');
    const confirmarBtn = document.getElementById('confirmar-pago');
    
    // Establecer fecha actual
    fechaHoyInput.value = new Date().toISOString().split('T')[0];
    
    // Establecer fecha mínima de entrega (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fechaEntregaInput.min = tomorrow.toISOString().split('T')[0];
    fechaEntregaInput.value = tomorrow.toISOString().split('T')[0];
    
    // Evento para crear pedido
    confirmarBtn.addEventListener('click', async function() {
        await crearPedido();
    });
});

async function obtenerUsuarioSesion() {
    try {
        const response = await fetch('/usuario/obtenerUsuarioSesion', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener usuario de sesión');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function crearPedido() {
    const btn = document.getElementById('confirmar-pago');
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
        // 1. Obtener usuario de sesión
        const usuario = await obtenerUsuarioSesion();
        if (!usuario?.id) {
            throw new Error('Debes iniciar sesión para realizar un pedido');
        }

        // 2. Validar fecha de entrega
        const fechaEntrega = document.getElementById('fecha-entrega').value;
        if (!fechaEntrega) {
            throw new Error('Selecciona una fecha de entrega válida');
        }

        // 3. Obtener carrito
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            throw new Error('El carrito está vacío');
        }

        // 4. Preparar datos del pedido
        const pedidoData = {
            usuario: { id: usuario.id },
            fechaPedido: document.getElementById('fecha-hoy').value,
            fechaEntrega: fechaEntrega,
            entregado: false,
            pagado: true,
            detalles: carrito.map(item => ({
                carne: { id: item.id },
                pesoEnKilos: item.cantidad,
                precioPorKilo: item.precioPorKg
            }))
        };

        // 5. Enviar pedido al servidor
        const response = await fetch('/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear pedido');
        }

        // 6. Procesar respuesta exitosa
        const pedidoCreado = await response.json();
        localStorage.removeItem('carrito');
        
    } catch (error) {
        console.error('Error al crear pedido:', error);
        alert(error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar Pago y Pedido';
    }
}