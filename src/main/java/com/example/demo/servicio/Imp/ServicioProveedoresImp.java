package com.example.demo.servicio.Imp;

import com.example.demo.modelo.Proveedores;
import com.example.demo.repositorio.RepositorioProveedores;
import com.example.demo.servicio.ServicioProveedores;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioProveedoresImp implements ServicioProveedores {

    private final RepositorioProveedores repositorioProveedores;

    public ServicioProveedoresImp(RepositorioProveedores repositorioProveedores) {
        this.repositorioProveedores = repositorioProveedores;
    }

    @Override
    public List<Proveedores> obtenerTodosProveedores() {
        return repositorioProveedores.findAll();
    }

    @Override
    public Proveedores obtenerProveedorPorId(Long id) {
        return repositorioProveedores.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));
    }

    @Override
    public Proveedores guardarProveedor(Proveedores proveedor) {
        if (proveedor.getId() != null && repositorioProveedores.existsById(proveedor.getId())) {
            // Actualización
            Proveedores proveedorExistente = repositorioProveedores.findById(proveedor.getId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + proveedor.getId()));
            
            proveedorExistente.setNombre(proveedor.getNombre());
            proveedorExistente.setTelefono(proveedor.getTelefono());
            proveedorExistente.setActivo(proveedor.isActivo());
            
            return repositorioProveedores.save(proveedorExistente);
        } else {
            // Creación
            return repositorioProveedores.save(proveedor);
        }
    }

    @Override
    public void eliminarProveedor(Long id) {
        if (!repositorioProveedores.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Proveedor no encontrado con ID: " + id);
        }
        repositorioProveedores.deleteById(id);
    }
}