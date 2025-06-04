package com.example.demo.repositorio;

import com.example.demo.modelo.Proveedores;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioProveedores extends JpaRepository<Proveedores, Long> {
    
}