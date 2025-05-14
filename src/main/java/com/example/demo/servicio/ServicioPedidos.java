package com.example.demo.servicio;

import com.example.demo.modelo.EntidadPedido;
import java.util.List;

public interface ServicioPedidos {
    List<EntidadPedido> obtenerTodosLosPedidos();
    EntidadPedido obtenerPedidoPorId(long id);
    List<EntidadPedido> obtenerPedidosPorUsuario(long usuarioId);
    List<EntidadPedido> obtenerPedidosPorEstado(boolean entregado, boolean pagado);
    EntidadPedido guardarPedido(EntidadPedido pedido);
    void eliminarPedido(Long id);
    List<EntidadPedido> obtenerPedidosPorFechaEntrega(String fechaInicio, String fechaFin);
    EntidadPedido actualizarEstadoPedido(Long id, boolean entregado, boolean pagado);
}
