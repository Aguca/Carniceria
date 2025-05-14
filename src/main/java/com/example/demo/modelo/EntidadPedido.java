package com.example.demo.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
public class EntidadPedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private EntidadUsuario usuario;

    @Column(nullable = false)
    private LocalDate fechaPedido;

    @Column(nullable = false)
    private LocalDate fechaEntrega;

    @Column(nullable = false)
    private boolean entregado;

    @Column(nullable = false)
    private boolean pagado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntidadDetallePedido> detalles;
}