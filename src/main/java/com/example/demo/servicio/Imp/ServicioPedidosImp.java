package com.example.demo.servicio.Imp;

import com.example.demo.modelo.EntidadPedido;
import com.example.demo.modelo.EntidadUsuario;
import com.example.demo.repositorio.RepositorioPedidos;
import com.example.demo.repositorio.RepositorioServicioUsuario;
import com.example.demo.servicio.ServicioPedidos;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioPedidosImp implements ServicioPedidos {

    private final RepositorioPedidos repositorioPedidos;
    private final RepositorioServicioUsuario repositorioUsuarios;

    public ServicioPedidosImp(RepositorioPedidos repositorioPedidos,
                              RepositorioServicioUsuario repositorioUsuarios) {
        this.repositorioPedidos = repositorioPedidos;
        this.repositorioUsuarios = repositorioUsuarios;
    }

    @Override
    public List<EntidadPedido> obtenerTodosLosPedidos() {
        return repositorioPedidos.findAll();
    }

    @Override
    public EntidadPedido obtenerPedidoPorId(long id) {
        return repositorioPedidos.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró el pedido con ID: " + id));
    }

    @Override
    public List<EntidadPedido> obtenerPedidosPorUsuario(long usuarioId) {
        EntidadUsuario usuario = repositorioUsuarios.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        return repositorioPedidos.findByUsuario(usuario);
    }

    @Override
    public List<EntidadPedido> obtenerPedidosPorEstado(boolean entregado, boolean pagado) {
        return repositorioPedidos.findByEntregadoAndPagado(entregado, pagado);
    }

    @Override
    public EntidadPedido guardarPedido(EntidadPedido pedido) {
        if (pedido.getId() != null && repositorioPedidos.existsById(pedido.getId())) {
            EntidadPedido pedidoExistente = repositorioPedidos.findById(pedido.getId())
                    .orElseThrow(() -> new RuntimeException("No se encontró el pedido con ID: " + pedido.getId()));

            // Actualizar campos del pedido
            pedidoExistente.setFechaEntrega(pedido.getFechaEntrega());
            pedidoExistente.setEntregado(pedido.isEntregado());
            pedidoExistente.setPagado(pedido.isPagado());

            return repositorioPedidos.save(pedidoExistente);
        } else {
            // Establecer fecha de pedido automáticamente
            if(pedido.getFechaPedido() == null) {
                pedido.setFechaPedido(LocalDate.now());
            }
            return repositorioPedidos.save(pedido);
        }
    }

    @Override
    public void eliminarPedido(Long id) {
        if (!repositorioPedidos.existsById(id)) {
            throw new RuntimeException("No se encontró el pedido con ID: " + id);
        }
        repositorioPedidos.deleteById(id);
    }

    @Override
    public List<EntidadPedido> obtenerPedidosPorFechaEntrega(String fechaInicio, String fechaFin) {
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);
        return repositorioPedidos.findByFechaEntregaBetween(inicio, fin);
    }

    @Override
    public EntidadPedido actualizarEstadoPedido(Long id, boolean entregado, boolean pagado) {
        EntidadPedido pedido = repositorioPedidos.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró el pedido con ID: " + id));

        pedido.setEntregado(entregado);
        pedido.setPagado(pagado);

        return repositorioPedidos.save(pedido);
    }
}