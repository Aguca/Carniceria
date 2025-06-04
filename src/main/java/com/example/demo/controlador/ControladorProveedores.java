package com.example.demo.controlador;

import com.example.demo.modelo.Proveedores;
import com.example.demo.servicio.ServicioProveedores;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
public class ControladorProveedores {

    private final ServicioProveedores servicioProveedores;

    public ControladorProveedores(ServicioProveedores servicioProveedores) {
        this.servicioProveedores = servicioProveedores;
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodosProveedores() {
        try {
            List<Proveedores> proveedores = servicioProveedores.obtenerTodosProveedores();
            if (proveedores.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontraron proveedores");
            }
            return ResponseEntity.ok(proveedores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener proveedores: " + e.getMessage());
        }
    }

        // Método DELETE para eliminar proveedores
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProveedor(@PathVariable Long id) {
        try {
            servicioProveedores.eliminarProveedor(id);
            return ResponseEntity.ok().body("Proveedor eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar proveedor: " + e.getMessage());
        }
    }

        @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProveedor(@PathVariable Long id, @RequestBody Proveedores proveedor) {
        try {
            Proveedores proveedorActualizado = servicioProveedores.guardarProveedor(proveedor);
            return ResponseEntity.ok(proveedorActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar proveedor: " + e.getMessage());
        }
    }

        @PostMapping
    public ResponseEntity<?> crearProveedor(@RequestBody Proveedores proveedor) {
        try {
            Proveedores nuevoProveedor = servicioProveedores.guardarProveedor(proveedor);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProveedor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear proveedor: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProveedorPorId(@PathVariable Long id) {
        try {
            Proveedores proveedor = servicioProveedores.obtenerProveedorPorId(id);
            return ResponseEntity.ok(proveedor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}