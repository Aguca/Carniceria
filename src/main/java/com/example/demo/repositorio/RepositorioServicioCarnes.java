package com.example.demo.repositorio;

import com.example.demo.modelo.EntidadCarne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioServicioCarnes extends JpaRepository<EntidadCarne, Long> {

    List<EntidadCarne> findByTipoCarne(String tipoCarne);
    EntidadCarne findByTipoCorte (String tipoCorte);
    EntidadCarne findByNombre (String nombre);
    long countByIdIn(List<Long> ids);

}
