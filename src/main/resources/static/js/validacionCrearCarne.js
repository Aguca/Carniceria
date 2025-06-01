document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAñadirCarne');
    const submitBtn = form.querySelector('.btn-primary');
    
    // Campos obligatorios
    const camposObligatorios = [
        { id: 'nombre', mensaje: 'El nombre es obligatorio' },
        { id: 'tipoCarne', mensaje: 'Debe seleccionar un tipo de carne' },
        { id: 'tipoCorte', mensaje: 'Debe seleccionar un tipo de corte' },
        { id: 'precio', mensaje: 'El precio es obligatorio (mínimo 5€)' },
        { id: 'descripcion', mensaje: 'La descripción es obligatoria' }
    ];

    // Validar todos los campos
    function validarCampos() {
        let esValido = true;
        
        // Limpiar errores anteriores
        document.querySelectorAll('.error-mensaje').forEach(el => el.remove());
        
        camposObligatorios.forEach(campo => {
            const elemento = document.getElementById(campo.id);
            const valor = elemento.value.trim();
            let campoValido = true;
            
            // Validación específica para cada campo
            if (campo.id === 'tipoCarne' || campo.id === 'tipoCorte') {
                campoValido = valor !== '';
            } else if (campo.id === 'precio') {
                campoValido = valor !== '' && parseFloat(valor) >= 5;
            } else {
                campoValido = valor !== '';
            }
            
            // Mostrar error si no es válido
            if (!campoValido) {
                esValido = false;
                mostrarError(elemento, campo.mensaje);
            }
        });
        
        return esValido;
    }

    // Mostrar mensaje de error bajo el campo
    function mostrarError(elemento, mensaje) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-mensaje';
        errorElement.textContent = mensaje;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8em';
        errorElement.style.marginTop = '5px';
        elemento.parentNode.appendChild(errorElement);
        
        // Resaltar el campo con error
        elemento.style.borderColor = 'red';
        
        // Quitar el resaltado cuando se corrija
        elemento.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '';
                errorElement.remove();
            }
        });
    }

    // Validar al enviar el formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validarCampos()) {
            // Aquí iría el código para guardar la carne
            alert('Todos los campos son válidos. Guardando carne...');
            // form.submit(); // Descomentar para enviar el formulario
        } else {
            // El mensaje de error ya se muestra en cada campo
        }
    });

    // Validación en tiempo real para campos de texto/textarea
    document.getElementById('nombre').addEventListener('blur', validarCampos);
    document.getElementById('descripcion').addEventListener('blur', validarCampos);
    document.getElementById('precio').addEventListener('blur', validarCampos);
    
    // Validación en tiempo real para selects
    document.getElementById('tipoCarne').addEventListener('change', validarCampos);
    document.getElementById('tipoCorte').addEventListener('change', validarCampos);
});