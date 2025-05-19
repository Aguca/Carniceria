package com.example.demo.servicio;

import com.example.demo.modelo.EntidadPedido;
import com.example.demo.modelo.EntidadDetallePedido;
import java.util.List;
import java.util.Optional;

public interface ServicioPedidos {
    EntidadPedido guardarPedido(EntidadPedido pedido);
    Optional<EntidadPedido> obtenerPedidoPorId(Long id);
    List<EntidadPedido> obtenerTodosLosPedidos();
    void eliminarPedido(Long id);
    EntidadPedido actualizarPedido(EntidadPedido pedido);
    
    // Nuevos métodos para detalles
    EntidadDetallePedido guardarDetallePedido(EntidadDetallePedido detalle);
    List<EntidadDetallePedido> obtenerDetallesPorPedidoId(Long pedidoId);
    void eliminarDetallePedido(Long id);
}