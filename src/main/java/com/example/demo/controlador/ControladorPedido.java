package com.example.demo.controlador;

import com.example.demo.modelo.EntidadPedido;
import com.example.demo.modelo.EntidadCarne;
import com.example.demo.modelo.EntidadDetallePedido;
import com.example.demo.modelo.EntidadUsuario;
import com.example.demo.servicio.ServicioPedidos;
import com.example.demo.servicio.ServicioCarnes;

import org.apache.el.stream.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
public class ControladorPedido {

    private final ServicioPedidos servicioPedidos;
    private final ServicioCarnes servicioCarne;

    public ControladorPedido(ServicioPedidos servicioPedidos, ServicioCarnes servicioCarne) {
        this.servicioPedidos = servicioPedidos;
        this.servicioCarne = servicioCarne;
    }

@PostMapping
@Transactional
public ResponseEntity<?> crearPedido(@RequestBody EntidadPedido pedidoRequest, HttpSession session) {
    try {
        // 1. Validar usuario en sesión
        EntidadUsuario usuario = (EntidadUsuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "message", "Debe iniciar sesión",
                    "status", HttpStatus.UNAUTHORIZED.value()
                ));
        }

        // 2. Validar coincidencia de usuario
        if (pedidoRequest.getUsuario() == null || !pedidoRequest.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "message", "Usuario no válido",
                    "status", HttpStatus.BAD_REQUEST.value()
                ));
        }

        // 3. Validar detalles
        if (pedidoRequest.getDetalles() == null || pedidoRequest.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "message", "El pedido debe contener items",
                    "status", HttpStatus.BAD_REQUEST.value()
                ));
        }

        // 5. Crear y configurar el pedido
        EntidadPedido pedido = EntidadPedido.builder()
            .usuario(usuario)
            .fechaPedido(pedidoRequest.getFechaPedido())
            .fechaEntrega(pedidoRequest.getFechaEntrega())
            .entregado(false)
            .pagado(true)
            .build();

        // 6. Versión mínima pero funcional
        pedidoRequest.getDetalles().forEach(detalleRequest -> {
            EntidadCarne carne = new EntidadCarne();
            carne.setId(detalleRequest.getCarne().getId());
            
            EntidadDetallePedido detalle = new EntidadDetallePedido();
            detalle.setCarne(carne);
            detalle.setPesoEnKilos(detalleRequest.getPesoEnKilos());
            detalle.setPrecioPorKilo(detalleRequest.getPrecioPorKilo());
            pedido.agregarDetalle(detalle);
        });

        // 7. Guardar el pedido
        EntidadPedido pedidoGuardado = servicioPedidos.guardarPedido(pedido);
        
        return ResponseEntity.ok(Map.of(
            "message", "Pedido creado exitosamente",
            "pedido", pedidoGuardado,
            "status", HttpStatus.OK.value()
        ));
        
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                "message", "Error al crear pedido: " + e.getMessage(),
                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "error", e.getClass().getSimpleName()
            ));
    }
}

@GetMapping("/{id}")
public ResponseEntity<?> obtenerPedido(@PathVariable Long id) {
    java.util.Optional<EntidadPedido> pedidoOpt = servicioPedidos.obtenerPedidoPorId(id);
    
    if (pedidoOpt.isPresent()) {
        return ResponseEntity.ok(pedidoOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "message", "Pedido no encontrado",
                "status", HttpStatus.NOT_FOUND.value()
            ));
    }
}

    @GetMapping
    public ResponseEntity<List<EntidadPedido>> obtenerTodosLosPedidos() {
        List<EntidadPedido> pedidos = servicioPedidos.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> actualizarPedido(
            @PathVariable Long id, 
            @RequestBody EntidadPedido pedido,
            HttpSession session) {
        
        try {
            // Validar usuario en sesión
            EntidadUsuario usuarioSesion = (EntidadUsuario) session.getAttribute("usuario");
            if (usuarioSesion == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "No hay usuario en sesión",
                    "status", HttpStatus.UNAUTHORIZED.value()
                ));
            }

            // Validar que el pedido pertenece al usuario
            if (!pedido.getUsuario().getId().equals(usuarioSesion.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", "No tienes permiso para modificar este pedido",
                    "status", HttpStatus.FORBIDDEN.value()
                ));
            }

            pedido.setId(id);
            EntidadPedido pedidoActualizado = servicioPedidos.actualizarPedido(pedido);
            return ResponseEntity.ok(pedidoActualizado);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message", "Error al actualizar el pedido: " + e.getMessage(),
                    "status", HttpStatus.INTERNAL_SERVER_ERROR.value()
                ));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarPedido(@PathVariable Long id, HttpSession session) {
        try {
            // Validar usuario en sesión
            EntidadUsuario usuarioSesion = (EntidadUsuario) session.getAttribute("usuario");
            if (usuarioSesion == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "No hay usuario en sesión",
                    "status", HttpStatus.UNAUTHORIZED.value()
                ));
            }

            // Validar que el pedido pertenece al usuario
            EntidadPedido pedido = servicioPedidos.obtenerPedidoPorId(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
                
            if (!pedido.getUsuario().getId().equals(usuarioSesion.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", "No tienes permiso para eliminar este pedido",
                    "status", HttpStatus.FORBIDDEN.value()
                ));
            }

            servicioPedidos.eliminarPedido(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message", "Error al eliminar el pedido: " + e.getMessage(),
                    "status", HttpStatus.INTERNAL_SERVER_ERROR.value()
                ));
        }
    }
}