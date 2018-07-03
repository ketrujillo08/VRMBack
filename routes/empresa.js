var express = require('express');
var Empresa = require('../models/empresa');

var app = express();

app.post('/', (req, res) => {
    var body = req.body;
    var empresa = new Empresa({
        nombre: body.nombre,
        activo: body.activo
    });

    empresa.save((err, nuevoRegistro) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al guardar el registro',
                error: err
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Empresa Guardada con Exito",
            usuario: nuevoRegistro
        });
    });
});

app.put('/:id', (req, res) => {
    var idEmpresa = req.params.id;
    var body = req.body;

    Empresa.findByIdAndUpdate(idEmpresa, body, (err, empresaActualizada) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al guardar el registro',
                error: err
            });
        }
        if (!empresaActualizada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Empresa no existe',
                error: err
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: 'Empresa actualizada exitosa mente',
            empresa: empresaActualizada
        });
    });
});

app.delete('/:id', (req, res) => {
    var idEmpresa = req.params.id;
    Empresa.findByIdAndRemove(idEmpresa, (err, empresaEliminada) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error en base de datos',
                error: err
            });
        }
        if (!empresaEliminada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'La empresa no existe',
                id: idEmpresa
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Empresa eliminada",
            empresa: empresaEliminada
        });
    });
});

app.get('/', (req, res) => {
    var desde = Number(req.query.desde) || 0;
    var limit = Number(req.query.limit) || 40;
    desde = Number(desde);
    Empresa.find({})
        .skip(desde)
        .limit(limit)
        .exec((err, empresas) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Error al consultar empresas',
                    error: err
                });
            }
            if (!empresas) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Sin registros en la consulta',
                });
            }
            Empresa.count({}, (e, conteo) => {
                res.status(200).json({
                    exito: true,
                    mensaje: 'Empresas encontradas',
                    total: conteo,
                    empresas: empresas
                });
            });
        });
});

app.get("/:id", (req, res) => {
    var id = req.params.id;
    Empresa.findById(id, (error, empresa) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error al consultar empresas',
                error: err
            });
        }
        if (!empresa) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Sin registros en la consulta',
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: "Registros encontrado",
            empresa: empresa
        });
    });

});

module.exports = app;