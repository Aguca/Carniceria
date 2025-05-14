package com.example.demo.repositorio;

import com.example.demo.modelo.EntidadPedido;
import com.example.demo.modelo.EntidadUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RepositorioPedidos extends JpaRepository<EntidadPedido, Long> {

    // Buscar pedidos por usuario
    List<EntidadPedido> findByUsuario(EntidadUsuario usuario);

    // Buscar pedidos por estado de entrega y pago
    List<EntidadPedido> findByEntregadoAndPagado(boolean entregado, boolean pagado);

    // Buscar pedidos por rango de fechas de entrega
    List<EntidadPedido> findByFechaEntregaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    // Buscar pedidos entregados o no entregados
    List<EntidadPedido> findByEntregado(boolean entregado);

    // Buscar pedidos pagados o no pagados
    List<EntidadPedido> findByPagado(boolean pagado);

    // Buscar pedidos por fecha de pedido
    List<EntidadPedido> findByFechaPedido(LocalDate fechaPedido);
}