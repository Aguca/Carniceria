package com.example.demo.servicio.Imp;

import com.example.demo.modelo.EntidadUsuario;
import org.springframework.stereotype.Service;
import com.example.demo.repositorio.RepositorioServicioUsuario;
import com.example.demo.servicio.ServicioUsuario;

import java.util.List;

@Service
public class ServicioUsuarioImp implements ServicioUsuario {

    private final RepositorioServicioUsuario repositorioServicioUsuario;

    public ServicioUsuarioImp(RepositorioServicioUsuario repositorioServicioUsuario) {
        this.repositorioServicioUsuario = repositorioServicioUsuario;
    }
    @Override
    public List<EntidadUsuario> obtenerUsuarios() {
        return repositorioServicioUsuario.findAll();
    }
    @Override
    public EntidadUsuario obtenerUsuarioPorId (long id) {
        return repositorioServicioUsuario.findById(id).get();
    }
    @Override
    public EntidadUsuario obtenerUsuarioPorDni (String dni) {
        EntidadUsuario usuario = repositorioServicioUsuario.findByDni(dni);
        return usuario;
    }
    @Override
    public EntidadUsuario obtenerUsuarioPorEmail (String email) {
        EntidadUsuario usuario = repositorioServicioUsuario.findByEmail(email);
        return usuario;
    }
    @Override
    public EntidadUsuario guardarUsuario(@org.jetbrains.annotations.NotNull EntidadUsuario usuario) {
        if (usuario.getId() != null && repositorioServicioUsuario.existsById(usuario.getId())) {
            EntidadUsuario usuarioExistente = repositorioServicioUsuario.findById(usuario.getId())
                .orElseThrow (() -> new RuntimeException("No se ha encontrado el usuario por el ID dado: " + usuario.getId()));

            //Se actualiza el usuario
            usuarioExistente.setNombre(usuario.getNombre());
            usuarioExistente.setTipo(usuario.getTipo());
            usuarioExistente.setApellido(usuario.getApellido());
            usuarioExistente.setTipo(usuario.getTipo());
            usuarioExistente.setEmail(usuario.getEmail());
            usuarioExistente.setDni(usuario.getDni());
            usuarioExistente.setTelefono(usuario.getTelefono());
            usuarioExistente.setCalle(usuario.getCalle());
            usuarioExistente.setContrasena(usuario.getContrasena());

            return repositorioServicioUsuario.save(usuarioExistente);

        } else  {
            //Se crea un nuevo usuario
            return repositorioServicioUsuario.save(usuario);
        }
    }

    @Override
    public void eliminarUsuario(Long id) {
        repositorioServicioUsuario.deleteById(id);
    }
}
