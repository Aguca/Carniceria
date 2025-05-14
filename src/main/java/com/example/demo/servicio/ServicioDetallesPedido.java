package com.example.demo.servicio;

import com.example.demo.modelo.EntidadDetallePedido;
import java.util.List;

public interface ServicioDetallesPedido {
    List<EntidadDetallePedido> obtenerTodosLosDetalles();
    EntidadDetallePedido obtenerDetallePorId(long id);
    List<EntidadDetallePedido> obtenerDetallesPorPedido(long pedidoId);
    List<EntidadDetallePedido> obtenerDetallesPorCarne(long carneId);
    EntidadDetallePedido guardarDetalle(EntidadDetallePedido detalle);
    void eliminarDetalle(Long id);
    List<EntidadDetallePedido> actualizarDetallesPedido(long pedidoId, List<EntidadDetallePedido> detalles);
}