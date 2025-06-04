package com.example.demo.controlador;

import com.example.demo.modelo.EntidadUsuario;
import com.example.demo.repositorio.RepositorioServicioUsuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/editarUsuario")
public class EditarUsuarioControlador {

    @Autowired
    private RepositorioServicioUsuario usuarioRepository;

    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizarUsuario(@RequestBody EntidadUsuario usuarioActualizado, HttpSession sesion) {
        EntidadUsuario usuarioSesion = (EntidadUsuario) sesion.getAttribute("usuario");

        if (usuarioSesion == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay usuario autenticado en la sesión");
        }

        // Validamos que el usuario de la sesión es el mismo que se está actualizando
        if (!usuarioSesion.getId().equals(usuarioActualizado.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No puedes modificar otro usuario");
        }

        try {
            EntidadUsuario usuarioPersistente = usuarioRepository.findById(usuarioActualizado.getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));

            // Actualizamos los campos necesarios
            usuarioPersistente.setNombre(usuarioActualizado.getNombre());
            usuarioPersistente.setApellido(usuarioActualizado.getApellido());
            usuarioPersistente.setEmail(usuarioActualizado.getEmail());
            usuarioPersistente.setTelefono(usuarioActualizado.getTelefono());
            usuarioPersistente.setCalle(usuarioActualizado.getCalle());
            usuarioPersistente.setDni(usuarioActualizado.getDni());
            usuarioPersistente.setContrasena(usuarioActualizado.getContrasena());
            // tipo no se cambia si no es necesario

            usuarioRepository.save(usuarioPersistente);

            // Actualizamos la sesión
            sesion.setAttribute("usuario", usuarioPersistente);

            return ResponseEntity.ok("Perfil actualizado correctamente");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el usuario: " + e.getMessage());
        }
    }
}
