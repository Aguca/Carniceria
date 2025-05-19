package com.example.demo.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntidadPedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Cambiado a IDENTITY para mejor soporte
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // Optimización de carga
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_pedido_usuario"))
    private EntidadUsuario usuario;

    @Column(nullable = false)
    private LocalDate fechaPedido;

    @Column(nullable = false)
    private LocalDate fechaEntrega;

    @Column(nullable = false)
    private boolean entregado;

    @Column(nullable = false)
    private boolean pagado;

    @OneToMany(
        mappedBy = "pedido", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true,
        fetch = FetchType.EAGER)  // Carga eager para detalles
    @Builder.Default  // Para inicializar correctamente con Lombok
    private List<EntidadDetallePedido> detalles = new ArrayList<>();

    // Método mejorado para agregar detalles
    public void agregarDetalle(EntidadDetallePedido detalle) {
        detalle.setPedido(this);
        detalles.add(detalle);
    }

    // Método para eliminar detalles
    public void removerDetalle(EntidadDetallePedido detalle) {
        detalles.remove(detalle);
        detalle.setPedido(null);
    }

/**
 * Calcula el total del pedido sumando los subtotales de todos los detalles
 * @return Total del pedido con precisión de 2 decimales
 */
public BigDecimal calcularTotal() {
    return detalles.stream()
        .map(EntidadDetallePedido::calcularSubtotal) // Usa el método calcularSubtotal() de cada detalle
        .reduce(BigDecimal.ZERO, BigDecimal::add) // Suma todos los subtotales
        .setScale(2, RoundingMode.HALF_UP); // Asegura 2 decimales
}
}