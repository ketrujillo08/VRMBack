var express = require("express");
var Estado = require("../models/estado");
var middleware = require('../middleware/webToken');
var app = express();

app.get('/', (req, res) => {

    var empresa = req.query.empresa;
    var where = {};
    if (typeof empresa !== 'undefined') {
        where.empresa = empresa;
    }
    var limit = Number(req.query.limit) || 40;
    var desde = Number(req.query.desde) || 0;

    Estado.find(where)
        .skip(desde)
        .limit(limit)
        .populate('empresa')
        .exec((err, estados) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error interno",
                    error: err
                });
            }
            if (estados.length <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Sin registros"
                });
            }

            Estado.count((e, total) => {
                res.status(200).json({
                    exito: true,
                    mensaje: 'Listado de estados',
                    total: total,
                    estados: estados
                });
            });

        });

});



app.get("/:id", (req, res) => {

    var id = req.params.id;
    Estado.findById(id)
        .populate('empresa')
        .exec((err, estado) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error interno",
                    error: e
                });
            }
            if (!estado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: "No se encontro ningun registro",
                    error: e
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: "Consulta exitosa",
                estado: estado
            });

        });

});


app.post("/", [middleware.verificaToken], (req, res) => {
    var body = req.body;

    estado = new Estado({
        estado: body.estado,
        empresa: body.empresa,
        activo: body.activo
    });

    estado.save((err, estadoGuardado) => {

        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al guardar estado de servicio",
                error: err
            });
        }
        if (!estado) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al guardar estado de estado",
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: "Éxito al guardar el estado de servicio",
            estado: estadoGuardado
        });

    });

});

app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Estado.findByIdAndUpdate(id, body, (err, estadoActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al guardar estado de servicio",
                error: err
            });
        }
        if (!estadoActualizado) {

            return res.status(404).json({
                exito: false,
                mensaje: "El estado de servicio no existe"
            });

        }
        res.status(200).json({
            exito: true,
            mensaje: "Éxito al actualizar el estado de servicio",
            estado: estadoActualizado
        });
    });
});

app.delete("/:id", (req, res) => {
    var id = req.params.id;

    Estado.findByIdAndRemove(id, (err, estadoEliminado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al eliminar estado de servicio",
                error: err
            });
        }
        if (!estadoEliminado) {

            return res.status(404).json({
                exito: false,
                mensaje: "El estado de servicio no existe"
            });

        }
        res.status(200).json({
            exito: true,
            mensaje: "Éxito al eliminar el estado de servicio",
            estado: estadoEliminado
        });


    });

});



module.exports = app;