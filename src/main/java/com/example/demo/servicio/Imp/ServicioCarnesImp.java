package com.example.demo.servicio.Imp;


import com.example.demo.modelo.EntidadCarne;
import com.example.demo.repositorio.RepositorioServicioCarnes;
import com.example.demo.servicio.ServicioCarnes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioCarnesImp implements ServicioCarnes {

    private final RepositorioServicioCarnes repositorioServicioCarnes;

    public ServicioCarnesImp(RepositorioServicioCarnes repositorioServicioCarnes) {
        this.repositorioServicioCarnes = repositorioServicioCarnes;
    }

    @Override
    public List<EntidadCarne> obtenerCarnes() {
        return repositorioServicioCarnes.findAll();
    }

    @Override
    public EntidadCarne obtenerCarnePorId(long id) {
        return repositorioServicioCarnes.findById(id).get();
    }

    @Override
    public EntidadCarne obtenerCarnePorNombre(String nombre) {
        return repositorioServicioCarnes.findByNombre(nombre);
    }

    //@Override
    //public EntidadCarne obtenerCarnePorTipo(String tipoCarne) {
        //return repositorioServicioCarnes.findByTipoCarne(tipoCarne);
    //}

    @Override
    public EntidadCarne guardarCarne(EntidadCarne carne) {
        if (carne.getId() != null && repositorioServicioCarnes.existsById(carne.getId())) {
            EntidadCarne carneExistente = repositorioServicioCarnes.findById(carne.getId())
                    .orElseThrow(() -> new RuntimeException("No se ha encontrado la carne por el ID dado: " + carne.getId()));

            // Se actualiza la carne
            carneExistente.setNombre(carne.getNombre());
            carneExistente.setTipoCarne(carne.getTipoCarne());
            carneExistente.setTipoCorte(carne.getTipoCorte());
            carneExistente.setDescripcion(carne.getDescripcion());
            carneExistente.setEurosPorKilo(carne.getEurosPorKilo());

            return repositorioServicioCarnes.save(carneExistente);
        } else {
            // Se crea una nueva carne
            return repositorioServicioCarnes.save(carne);
        }
    }

    @Override
    public void eliminarCarne(Long id) {
        repositorioServicioCarnes.deleteById(id);
    }

    @Override
    public List<EntidadCarne> obtenerCarnePorTipo(String tipoCarne) {
        return repositorioServicioCarnes.findByTipoCarne(tipoCarne);
    }
}
