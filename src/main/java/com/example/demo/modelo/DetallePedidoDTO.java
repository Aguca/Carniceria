package com.example.demo.modelo;

import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetallePedidoDTO {
    private Long id;
    private Long carneId;
    private String nombreCarne;
    private String tipoCorte;  // Añade este campo
    private BigDecimal pesoEnKilos;
    private BigDecimal precioPorKilo;
    private BigDecimal subtotal;
}