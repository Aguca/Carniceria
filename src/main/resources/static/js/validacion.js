document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroFrom');
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true; // Deshabilitar inicialmente el botón
    
    // Campos a validar
    const campos = [
        'nombre', 'apellido', 'email', 'contrasena', 'calle', 'telefono', 'dni'
    ];
    
    // Función para validar todos los campos
    function validarCampos() {
        let todosValidos = true;
        
        // Validar cada campo individualmente
        for (const campoId of campos) {
            const campo = document.getElementById(campoId);
            const valor = campo.value.trim();
            
            switch(campoId) {
                case 'nombre':
                case 'apellido':
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
                        todosValidos = false;
                    }
                    break;
                    
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                        todosValidos = false;
                    }
                    break;
                    
                case 'contrasena':
                    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(valor)) {
                        todosValidos = false;
                    }
                    break;
                    
                case 'calle':
                    if (valor.length < 5) {
                        todosValidos = false;
                    }
                    break;
                    
                case 'telefono':
                    if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/.test(valor)) {
                        todosValidos = false;
                    }
                    break;
                    
                case 'dni':
                    if (!/^[0-9]{8}[A-Za-z]$/.test(valor)) {
                        todosValidos = false;
                    } else {
                        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
                        const numero = valor.substr(0, 8);
                        const letra = valor.substr(8, 1).toUpperCase();
                        const letraCalculada = letras[numero % 23];
                        
                        if (letra !== letraCalculada) {
                            todosValidos = false;
                        }
                    }
                    break;
            }
            
            // Si algún campo no es válido, salir del bucle
            if (!todosValidos) break;
        }
        
        // Habilitar o deshabilitar el botón
        submitBtn.disabled = !todosValidos;
    }
    
    // Añadir event listeners a todos los campos
    campos.forEach(campoId => {
        document.getElementById(campoId).addEventListener('input', validarCampos);
    });
    
    // Event listener para el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!submitBtn.disabled) {
            alert('Formulario válido. Enviando datos...');
            // this.submit(); // Descomentar para enviar el formulario
            // window.location.href = 'bienvenida.html'; // O redirigir
        }
    });
    
    // Máscara para el teléfono (opcional)
    document.getElementById('telefono').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
            value = value[1] + (value[2] ? ' ' + value[2] : '') + (value[3] ? ' ' + value[3] : '');
        }
        
        e.target.value = value;
        validarCampos(); // Validar después de aplicar la máscara
    });
    
    // Convertir letra DNI a mayúscula (opcional)
    document.getElementById('dni').addEventListener('input', function(e) {
        if (e.target.value.length === 9) {
            e.target.value = e.target.value.substr(0, 8) + e.target.value.substr(8, 1).toUpperCase();
        }
        validarCampos(); // Validar después de modificar
    });
});