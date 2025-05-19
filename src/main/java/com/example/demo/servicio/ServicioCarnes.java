package com.example.demo.servicio;

import com.example.demo.modelo.EntidadCarne;

import java.util.List;

public interface ServicioCarnes {
    List<EntidadCarne> obtenerCarnes();
    EntidadCarne obtenerCarnePorId(long id);
    EntidadCarne obtenerCarnePorNombre (String nombre);
    //EntidadCarne obtenerCarnePorTipo (String tipoCarne);
    EntidadCarne guardarCarne (EntidadCarne carne);
    void eliminarCarne (Long id);
    List<EntidadCarne> obtenerCarnePorTipo(String tipoCarne);
    
}
