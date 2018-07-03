var express = require('express');
var bcrypt = require('bcryptjs');

var Usuario = require('../models/usuario');
//var Empresa = require('../models/empresa');

var app = express();

app.post('/', (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol,
        empresa: body.empresa
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al guardar usuario',
                error: err
            });
        }
        usuarioGuardado.password = undefined;
        res.status(200).json({
            exito: true,
            mensaje: 'Usuario guardado',
            usuario: usuarioGuardado
        });
    });
});

app.put('/:id', (req, res) => {
    var idUsuario = req.params.id;
    var update = req.body;
    Usuario.findByIdAndUpdate(idUsuario, update, (err, usuarioActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al actualizar usuario',
                error: err
            });
        }
        if (!usuarioActualizado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El usuario no existe'
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: 'Usuario actualizado',
            usuario: usuarioActualizado
        });
    });

});

app.delete('/:id', (req, res) => {
    var idUsuario = req.params.id;
    Usuario.findByIdAndRemove(idUsuario, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al eliminar usuario',
                error: err
            });
        }
        if (!usuarioEliminado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El usuario no existe'
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: 'Usuario eliminado',
            usuario: usuarioEliminado
        });
    });
});

app.get('/', (req, res) => {
    var desde = Number(req.query.desde) || 0;
    var limit = Number(req.query.limit) || 40;
    var rol = req.query.rol;
    var empresa = req.query.empresa;

    var where = {};

    if (typeof empresa != "undefined") {
        where.empresa = empresa;
    }


    if (rol) {
        where.rol = rol;
    }


    Usuario.find(where)
        .skip(desde)
        .limit(limit)
        .populate('empresa', 'nombre')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Error en la consulta',
                    error: err
                });
            }
            if (!usuarios) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Sin registros en la base de datos',
                });
            }
            Usuario.count((e, total) => {
                res.status(200).json({
                    exito: true,
                    mensaje: 'Listado de usuarios',
                    total: total,
                    usuarios: usuarios
                });
            });
        });
});

app.get("/:id", (req, res) => {
    var id = req.params.id;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error en la consulta',
                error: err
            });
        }
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Sin registros en la base de datos',
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Usuario encontrado",
            usuario: usuario
        });
    });
});



module.exports = app;