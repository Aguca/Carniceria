package com.example.demo.repositorio;

import com.example.demo.modelo.EntidadCarne;
import com.example.demo.modelo.EntidadDetallePedido;
import com.example.demo.modelo.EntidadPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDetallesPedido extends JpaRepository<EntidadDetallePedido, Long> {

    // Buscar detalles por pedido
    List<EntidadDetallePedido> findByPedido(EntidadPedido pedido);

    // Buscar detalles por carne
    List<EntidadDetallePedido> findByCarne(EntidadCarne carne);

    // Eliminar detalles por pedido (usado en actualización masiva)
    void deleteByPedido(EntidadPedido pedido);

    // Buscar detalles con peso mayor a X kilos
    List<EntidadDetallePedido> findByPesoEnKilosGreaterThan(double peso);

    // Buscar detalles con precio por kilo mayor a X
    List<EntidadDetallePedido> findByPrecioPorKiloGreaterThan(double precio);
}