document.addEventListener("DOMContentLoaded", function() {
    // Verificar sesión y permisos
    verificarSesionYPermisos();
    
    // Configurar envío del formulario
    document.getElementById('formCrearProveedor').addEventListener('submit', function(e) {
        e.preventDefault();
        crearProveedor();
    });
});

function verificarSesionYPermisos() {
    fetch('/usuario/comprobarsesion', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            alert("No estás autenticado. Redirigiendo a login...");
            window.location.href = '/index.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data.tipo !== 'admin') {
            alert("No eres administrador. No puedes acceder a esta página");
            window.location.href = '/index.html';
            return;
        }
    })
    .catch(error => {
        console.error("Error al verificar sesión:", error);
    });
}

async function crearProveedor() {
    try {
        const nuevoProveedor = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            activo: document.getElementById('activo').value === 'true'
        };
        
        const botonSubmit = document.querySelector('#formCrearProveedor button[type="submit"]');
        const textoOriginal = botonSubmit.textContent;
        botonSubmit.disabled = true;
        botonSubmit.textContent = 'Creando...';
        
        const response = await fetch('/proveedores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProveedor),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear proveedor');
        }
        
        alert('Proveedor creado correctamente');
        window.location.href = 'gestorProveedores.html';
        
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        alert(error.message || 'Error al crear proveedor');
    } finally {
        const botonSubmit = document.querySelector('#formCrearProveedor button[type="submit"]');
        if (botonSubmit) {
            botonSubmit.disabled = false;
            botonSubmit.textContent = textoOriginal;
        }
    }
}

function cerrarSesion() {
    fetch('/usuario/cerrarSesion', {
        method: 'POST',
        credentials: 'include'
    })
    .then(() => {
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
}