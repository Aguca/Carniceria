package com.example.demo.controlador;


import com.example.demo.modelo.EntidadCarne;
import com.example.demo.modelo.EntidadUsuario;
import com.example.demo.servicio.ServicioCarnes;
import com.example.demo.servicio.ServicioUsuario;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/administracion")
public class ControladorAdministracion {

    private final ServicioUsuario servicioUsuario;
    private final ServicioCarnes servicioCarnes;

    public ControladorAdministracion(ServicioUsuario servicioUsuario, ServicioCarnes servicioCarnes) {
        this.servicioUsuario = servicioUsuario;
        this.servicioCarnes = servicioCarnes;
    }

    @GetMapping("/usuarios")
    public List<EntidadUsuario> obtenerUsuarios() {
        return servicioUsuario.obtenerUsuarios();
    }

    @DeleteMapping("/usuarios/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        servicioUsuario.eliminarUsuario(id);
    }

    @GetMapping("/usuarios/{id}")
    public EntidadUsuario actualizarUsuario(@PathVariable Long id) {
        return servicioUsuario.obtenerUsuarioPorId(id);
    }

    @PutMapping("actualizado/usuario")
    public void actualizar(@RequestBody EntidadUsuario usuario) {
        servicioUsuario.guardarUsuario(usuario);
    }

    @GetMapping("/carnes")
    public List<EntidadCarne> obtenerCarnes() {
        return servicioCarnes.obtenerCarnes();
    }

    @GetMapping("/carnes/{id}")
    public EntidadCarne obtenerCarnePorId(@PathVariable Long id) {
        return servicioCarnes.obtenerCarnePorId(id);
    }

    @DeleteMapping("/carnes/{id}")
    public void eliminarCarne(@PathVariable Long id) {
        servicioCarnes.eliminarCarne(id);
    }

    @PutMapping("/carnes/carne")
    public void actualizarCarne(@RequestBody EntidadCarne carne) {
        servicioCarnes.guardarCarne(carne);
    }

}
