package com.example.demo.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "pedido")
public class EntidadDetallePedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "pedido_id", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_detalle_pedido")
    )
    private EntidadPedido pedido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "carne_id", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_detalle_carne")
    )
    private EntidadCarne carne;

    // Cambiado a BigDecimal para mejor manejo monetario
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pesoEnKilos;

    // Cambiado a BigDecimal para mejor manejo monetario
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioPorKilo;

    /**
     * Calcula el subtotal del detalle con precisión decimal
     */
    public BigDecimal calcularSubtotal() {
        return pesoEnKilos.multiply(precioPorKilo)
               .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Método para establecer la carne solo con ID
     */
    public void setCarneId(Long carneId) {
        if (this.carne == null) {
            this.carne = new EntidadCarne();
        }
        this.carne.setId(carneId);
    }

    /**
     * Representación segura para logging
     */
    public String toLogString() {
        return String.format(
            "DetallePedido[id=%d, carneId=%d, peso=%s kg, precio=%s €/kg, subtotal=%s €]",
            id,
            carne != null ? carne.getId() : null,
            pesoEnKilos.toPlainString(),
            precioPorKilo.toPlainString(),
            calcularSubtotal().toPlainString()
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EntidadDetallePedido)) return false;
        return id != null && id.equals(((EntidadDetallePedido) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // Métodos builder personalizados para Lombok
    public static class EntidadDetallePedidoBuilder {
        private BigDecimal pesoEnKilos = BigDecimal.ZERO;
        private BigDecimal precioPorKilo = BigDecimal.ZERO;

        public EntidadDetallePedidoBuilder pesoEnKilos(double peso) {
            this.pesoEnKilos = BigDecimal.valueOf(peso).setScale(2, RoundingMode.HALF_UP);
            return this;
        }

        public EntidadDetallePedidoBuilder precioPorKilo(double precio) {
            this.precioPorKilo = BigDecimal.valueOf(precio).setScale(2, RoundingMode.HALF_UP);
            return this;
        }

        public EntidadDetallePedidoBuilder pesoEnKilos(BigDecimal peso) {
            this.pesoEnKilos = peso.setScale(2, RoundingMode.HALF_UP);
            return this;
        }

        public EntidadDetallePedidoBuilder precioPorKilo(BigDecimal precio) {
            this.precioPorKilo = precio.setScale(2, RoundingMode.HALF_UP);
            return this;
        }
    }
}