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
public class EntidadCarne implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 50, nullable = false)
    private String nombre;

    @Column(length = 50, nullable = false)
    private String tipoCarne;

    @Column(length = 50, nullable = false)
    private String tipoCorte;

    @Column(length = 200, nullable = true)
    private String descripcion;

    @Column(length = 50, nullable = false)
    private Long EurosPorKilo;
}
