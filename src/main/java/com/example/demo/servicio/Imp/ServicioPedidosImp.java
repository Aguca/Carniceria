package com.example.demo.servicio.Imp;

import com.example.demo.modelo.EntidadPedido;
import com.example.demo.modelo.EntidadDetallePedido;
import com.example.demo.repositorio.RepositorioPedidos;
import com.example.demo.repositorio.RepositorioDetallesPedido;
import com.example.demo.servicio.ServicioPedidos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioPedidosImp implements ServicioPedidos {

    private final RepositorioPedidos repositorioPedidos;
    private final RepositorioDetallesPedido repositorioDetallePedidos;

    public ServicioPedidosImp(RepositorioPedidos repositorioPedidos, 
                            RepositorioDetallesPedido repositorioDetallePedidos) {
        this.repositorioPedidos = repositorioPedidos;
        this.repositorioDetallePedidos = repositorioDetallePedidos;
    }

    @Override
    @Transactional
    public EntidadPedido guardarPedido(EntidadPedido pedido) {
        // Guardar el pedido principal
        EntidadPedido pedidoGuardado = repositorioPedidos.save(pedido);
        
        // Guardar los detalles si existen
        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (EntidadDetallePedido detalle : pedido.getDetalles()) {
                detalle.setPedido(pedidoGuardado);
                repositorioDetallePedidos.save(detalle);
            }
        }
        
        return pedidoGuardado;
    }

    @Override
    public Optional<EntidadPedido> obtenerPedidoPorId(Long id) {
        return repositorioPedidos.findById(id);
    }

    @Override
    public List<EntidadPedido> obtenerTodosLosPedidos() {
        return repositorioPedidos.findAll();
    }

    @Override
    @Transactional
    public void eliminarPedido(Long id) {
        // Esto eliminará en cascada los detalles si está configurado en la entidad
        repositorioPedidos.deleteById(id);
    }

    @Override
    @Transactional
    public EntidadPedido actualizarPedido(EntidadPedido pedido) {
        if (pedido.getId() == null || !repositorioPedidos.existsById(pedido.getId())) {
            throw new IllegalArgumentException("No se puede actualizar un pedido que no existe");
        }
        
        // Actualizar el pedido principal
        EntidadPedido pedidoActualizado = repositorioPedidos.save(pedido);
        
        // Aquí podrías añadir lógica para actualizar los detalles si es necesario
        
        return pedidoActualizado;
    }

    // Implementación de los nuevos métodos para detalles
    @Override
    public EntidadDetallePedido guardarDetallePedido(EntidadDetallePedido detalle) {
        return repositorioDetallePedidos.save(detalle);
    }

    @Override
    public List<EntidadDetallePedido> obtenerDetallesPorPedidoId(Long pedidoId) {
        return repositorioDetallePedidos.findByPedidoId(pedidoId);
    }

    @Override
    @Transactional
    public void eliminarDetallePedido(Long id) {
        repositorioDetallePedidos.deleteById(id);
    }

    
}