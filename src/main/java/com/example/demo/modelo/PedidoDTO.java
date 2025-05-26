package com.example.demo.modelo;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PedidoDTO {
    private Long id;
    private LocalDate fechaPedido;
    private LocalDate fechaEntrega;
    private boolean entregado;
    private boolean pagado;
    private BigDecimal total;
    private String nombreUsuario;
    private List<DetallePedidoDTO> detalles;
}
