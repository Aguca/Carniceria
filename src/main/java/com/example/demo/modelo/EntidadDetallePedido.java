package com.example.demo.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
public class EntidadDetallePedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private EntidadPedido pedido;

    @ManyToOne
    @JoinColumn(name = "carne_id", nullable = false)
    private EntidadCarne carne;

    @Column(nullable = false)
    private double pesoEnKilos;

    @Column(nullable = false)
    private double precioPorKilo;
}