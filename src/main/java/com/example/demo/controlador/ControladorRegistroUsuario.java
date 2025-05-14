package com.example.demo.controlador;


import com.example.demo.modelo.EntidadUsuario;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.demo.servicio.ServicioUsuario;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("formularioRegistro")
public class ControladorRegistroUsuario {

    private final ServicioUsuario servicioUsuario;

    public ControladorRegistroUsuario(ServicioUsuario servicioUsuario) {
        this.servicioUsuario = servicioUsuario;
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> registroUsuario (@RequestBody Map<String, String> loginRequest) {
        String nombre = loginRequest.get("nombre");
        String apellido = loginRequest.get("apellido");
        String email = loginRequest.get("email");
        String contrasena = loginRequest.get("contrasena");
        String tipo = loginRequest.get("tipo");
        String calle = loginRequest.get("calle");
        String telefono = loginRequest.get("telefono");
        String dni = loginRequest.get("dni");

        //Crear usuario

        EntidadUsuario usuario = new EntidadUsuario();

        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setContrasena(contrasena);
        usuario.setTipo("normal");
        usuario.setCalle(calle);
        usuario.setTelefono(telefono);
        usuario.setDni(dni);

        Map<String, Boolean> respuesta = new HashMap<>();

        if(usuario != null) {
            respuesta.put("respuesta", true);
                servicioUsuario.guardarUsuario(usuario);
                return ResponseEntity.ok(respuesta);
        } else {
            respuesta.put("respuesta", false);
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

}
