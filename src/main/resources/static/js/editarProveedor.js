document.addEventListener("DOMContentLoaded", function() {
    // Verificar sesión y permisos (similar al otro archivo)
    verificarSesionYPermisos();
    
    // Cargar datos del proveedor desde localStorage
    const proveedorData = localStorage.getItem('proveedorEditar');
    
    if (!proveedorData) {
        alert('No se encontraron datos del proveedor a editar');
        window.location.href = 'gestorProveedores.html';
        return;
    }
    
    try {
        const proveedor = JSON.parse(proveedorData);
        
        // Rellenar formulario
        document.getElementById('proveedorId').value = proveedor.id;
        document.getElementById('nombre').value = proveedor.nombre;
        document.getElementById('telefono').value = proveedor.telefono;
        document.getElementById('activo').value = proveedor.activo;
        
        // Configurar envío del formulario
        document.getElementById('formEditarProveedor').addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCambios(proveedor.id);
        });
        
    } catch (error) {
        console.error('Error al parsear datos del proveedor:', error);
        alert('Error al cargar datos del proveedor');
        window.location.href = 'gestorProveedores.html';
    }
});

function verificarSesionYPermisos() {
    // Implementación similar a la del otro archivo
}

async function guardarCambios(id) {
    try {
        const proveedorActualizado = {
            id: id,
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            activo: document.getElementById('activo').value === 'true'
        };
        
        const response = await fetch(`/proveedores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedorActualizado)
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar los cambios');
        }
        
        // Limpiar localStorage después de guardar
        localStorage.removeItem('proveedorEditar');
        
        alert('Proveedor actualizado correctamente');
        window.location.href = 'gestorProveedores.html';
        
    } catch (error) {
        console.error('Error al guardar cambios:', error);
        alert(error.message || 'Error al guardar cambios');
    }
}