package com.example.demo.servicio;

import com.example.demo.modelo.Proveedores;
import java.util.List;

public interface ServicioProveedores {
    List<Proveedores> obtenerTodosProveedores();
    Proveedores obtenerProveedorPorId(Long id);
    Proveedores guardarProveedor(Proveedores proveedor);
    void eliminarProveedor(Long id);
}