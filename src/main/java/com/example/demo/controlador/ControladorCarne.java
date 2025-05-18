package com.example.demo.controlador;

import com.example.demo.modelo.EntidadCarne;
import com.example.demo.modelo.EntidadUsuario;
import com.example.demo.servicio.ServicioCarnes;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import jakarta.servlet.http.Cookie;

import java.util.List;

@Controller
@RequestMapping("/carne")
public class ControladorCarne {

    private final ServicioCarnes servicioCarnes;

    public ControladorCarne(ServicioCarnes servicioCarnes) {
        this.servicioCarnes = servicioCarnes;
    }

    @PostMapping("/guardarCarne")
    @ResponseBody
    public ResponseEntity<?> guardarCarne(@RequestBody EntidadCarne carne, HttpSession session) {
        session.setAttribute("carne", carne);
        return ResponseEntity.ok("Carne almacenada correctamente");

    }

    @GetMapping("/obtenerCarneDeSesion")
    public ResponseEntity<?> obtenerCarne(HttpSession session) {
        EntidadCarne carne = (EntidadCarne) session.getAttribute("carne");
        if (carne != null) {
            return ResponseEntity.ok(carne);
        } else {
            return ResponseEntity.status(UNAUTHORIZED).body("No hay carne en la sesion");
        }
    }

    @GetMapping("/ObtenerIdCarne")
    public ResponseEntity<?> obtenerIdCarne(HttpSession session) {
        EntidadCarne carne = (EntidadCarne) session.getAttribute("carne");
        if (carne != null) {
            return ResponseEntity.ok(carne.getId());
        } else {
            return ResponseEntity.status(UNAUTHORIZED).body("No hay carne en la sesion");
        }
    }

    @GetMapping("/obtenerPorTipo/{tipoCarne}")
    @ResponseBody
    public ResponseEntity<?> obtenerCarnesPorTipo(@PathVariable String tipoCarne) {
        try {
            List<EntidadCarne> carnes = servicioCarnes.obtenerCarnePorTipo(tipoCarne);

            if (carnes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontraron carnes del tipo: " + tipoCarne);
            }
            return ResponseEntity.ok(carnes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener carnes: " + e.getMessage());
        }
    }

    @GetMapping("/obtenerPorId/{id}")
    @ResponseBody
    public ResponseEntity<?> obtenerCarnePorId(@PathVariable Long id) {
        try {
            EntidadCarne carne = servicioCarnes.obtenerCarnePorId(id);
            return ResponseEntity.ok(carne);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("No se encontró")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al obtener carne: " + e.getMessage());
        }
    }
}