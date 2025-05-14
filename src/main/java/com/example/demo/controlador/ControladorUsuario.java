package com.example.demo.controlador;


import com.example.demo.modelo.EntidadUsuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/usuario")
public class ControladorUsuario {

    @GetMapping("/comprobarsesion")
    @ResponseBody
    public ResponseEntity<?> verificarSesion(HttpSession sesion) {
        System.out.println("Verificando la sesion: " + sesion.getId());
        EntidadUsuario usuario = (EntidadUsuario) sesion.getAttribute("usuario");

        if (usuario != null) { // Cambiado a !=
            System.out.println("Usuario en sesion: " + usuario.getEmail());
            return ResponseEntity.ok(usuario);
        } else {
            System.out.println("No hay usuarios en la sesion");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: No hay usuarios en la sesion");
        }
    }

    @PostMapping("/guardarUsuario")
    @ResponseBody
    public ResponseEntity<?> guardarUsuario(@RequestBody EntidadUsuario usuario, HttpSession sesion) {
        sesion.setAttribute("usuarioActualizado", usuario);
        return ResponseEntity.ok("Usuario almacenado en la sesion");
    }

    @GetMapping("/obtenerUsuarioSesion")
    public ResponseEntity<?> obtenerUsuarioSesion(HttpSession sesion) {
        EntidadUsuario usuario = (EntidadUsuario) sesion.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay usuarios en la sesion");
        }
    }

     @GetMapping("/obtenerUsuarioSesion1")
    public ResponseEntity<?> obtenerUsuarioSesion1(HttpSession sesion) {
         EntidadUsuario usuario = (EntidadUsuario) sesion.getAttribute("usuarioActualizado");
         if (usuario != null) {
             return ResponseEntity.ok(usuario);
         } else {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay usuarios en la sesion");
         }
     }

    @GetMapping("/ObtenerIdUsuario")
    public ResponseEntity<?> obtenerIdUsuario(HttpSession sesion) {
        EntidadUsuario usuario = (EntidadUsuario) sesion.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(usuario.getId());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay usuarios en la sesion");
        }
    }

    @GetMapping("/cerrarSesion")
    @ResponseBody
    public ResponseEntity<?> cerrarSesion(HttpSession sesion, HttpServletResponse response) {
        sesion.invalidate();
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return ResponseEntity.ok("Sesion cerrada");
    }

}


