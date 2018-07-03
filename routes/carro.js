var express = require('express');
var Carro = require('../models/carros');
var middleware = require('../middleware/webToken');
var app = express();


app.get('/', (req, res) => {

    var limit = Number(req.query.limit) || 40;
    var desde = Number(req.query.desde) || 0;
    var cliente = req.query.cliente;

    where = {};

    if (typeof cliente !== "undefined") {
        where.usuario = cliente;
    }

    Carro.find(where)
        .skip(desde)
        .limit(limit)
        .populate('usuario')
        .populate('creador')
        .exec((err, carros) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error interno",
                    error: err
                });
            }
            if (carros.length <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Sin registros"
                });
            }

            Carro.count((e, total) => {
                res.status(200).json({
                    exito: true,
                    mensaje: 'Listado de carros',
                    total: total,
                    carros: carros
                });
            });

        });

});

app.get("/:id", (req, res) => {
    var id = req.params.id;
    Carro.findById(id)
        .populate('usuario', 'nombre apellido')
        .populate('creador')
        .exec((err, carro) => {

            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Error interno',
                    error: err
                });
            }

            if (!carro) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Registros inexistente'
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: "Registro encontrado",
                carro: carro
            });

        });
});

app.post('/', [middleware.verificaToken], (req, res) => {
    var body = req.body;

    carro = new Carro({
        modelo: body.modelo,
        usuario: body.usuario,
        creador: req.usuario._id,
        anio: body.anio,
        placas: body.placas,
        comentarios: body.comentarios,
        color: body.color
    });
    carro.save((err, carro) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error interno",
                error: err
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: "Nuevo carro guardado",
            carro: carro
        });

    });
});

app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Carro.findByIdAndUpdate(id, body, (err, carroActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error interno",
                error: err
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Carro guardado",
            carro: carroActualizado
        });

    });

});

app.delete("/:id", (req, res) => {
    var id = req.params.id;

    Carro.findByIdAndRemove(id, (err, carroEliminado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error interno",
                error: err
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Carro eliminado",
            carro: carroEliminado
        });

    });
});

module.exports = app;