var express = require('express');
var Lavado = require('../models/lavado');
var middleware = require('../middleware/webToken');
var app = express();

app.post('/', [middleware.verificaToken], (req, res) => {
    var body = req.body;
    lavado = new Lavado({
        carro: body.carro,
        cliente: body.cliente,
        servicio: body.servicio,
        empresa: body.empresa,
        creador: body.creador,
        lluvia: body.lluvia,
        tapete: body.tapete,
        aroma: body.aroma,
        precio: body.precio,
        lavador: body.lavador,
        estado: body.estado,
        fecha: body.fecha,
        hora: body.hora
    });

    lavado.save((err, lavadoGuardado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error interno',
                error: err

            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Servicio guardado con éxito",
            lavado: lavadoGuardado

        });
    });

});
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Lavado.findByIdAndUpdate(id, body, (err, lavadoActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error interno',
                error: err

            });
        }
        if (!lavadoActualizado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Sin registros'
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Lavado Actualizado",
            lavado: lavadoActualizado

        });

    });


});
app.get('/', [middleware.verificaToken], (req, res) => {

    var empresa = req.query.empresa;
    var fecha = req.query.fecha;
    var where = {};

    if (req.usuario !== "ADMIN") {
        if (typeof empresa !== 'undefined') {
            where.empresa = empresa;
        }
        if (typeof fecha != "undefined") {

            fecha = new Date(fecha);
            /*var year = fecha.getFullYear();
            var month = fecha.getMonth();
            var day = Number(fecha.getDate()) + 2;*/
            var maxDate = new Date();
            maxDate.setDate(fecha.getDate() + 1);
            //var maxDate = new Date(year, month, day);
            //maxDate = fecha.getDate() + 1;
            //console.log(fecha);
            //console.log(maxDate);
            where.fecha = { "$gte": fecha, "$lte": maxDate };
        }
    }

    Lavado.find(where)
        .populate('servicio')
        .populate('cliente')
        .populate('carro')
        .populate('empresa')
        .populate('creador')
        .populate('lavador')
        .populate('estado')
        .exec((err, lavados) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Error interno',
                    error: err
                });
            }

            if (lavados.length <= 0) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Sin regitros'
                });
            }

            Lavado.count((e, total) => {
                if (e) {
                    res.status(400).status({
                        exito: false,
                        mensaje: 'Error interno',
                        error: e
                    });
                }

                res.status(200).json({
                    exito: true,
                    mensaje: "Consulta exitosa",
                    lavados: lavados,
                    total: total
                });
            })

        });

});

app.get("/:id", (req, res) => {

    var id = req.params.id;

    Lavado.findById(id, (err, lavado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error interno',
                error: err
            });
        }
        if (!lavado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Sin registros'
            });
        }
        res.status(200).json({
            exito: true,
            mensaje: "Consulta exitosa",
            lavado: lavado
        });

    });

});

module.exports = app;