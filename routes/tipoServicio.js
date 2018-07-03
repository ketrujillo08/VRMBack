var express = require("express");
var TipoServicio = require("../models/tipoServicio");

var app = express();


app.post("/", (req, res) => {
    var body = req.body;

    tipoServicio = new TipoServicio({
        servicio: body.servicio,
        empresa: body.empresa,
        activo: body.activo
    });

    tipoServicio.save((err, tipo) => {

        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al guardar tipo de servicio",
                error: err
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: "Éxito al guardar el tipo de servicio",
            tipoServicio: tipo
        });

    });

});

app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    TipoServicio.findByIdAndUpdate(id, body, (err, tipoServicioActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al guardar tipo de servicio",
                error: err
            });
        }
        if (!tipoServicioActualizado) {

            return res.status(404).json({
                exito: false,
                mensaje: "El servicio no existe"
            });

        }
        res.status(200).json({
            exito: true,
            mensaje: "Éxito al actualizar el servicio",
            tipoServicio: tipoServicioActualizado
        });
    });
});

app.delete("/:id", (req, res) => {
    var id = req.params.id;

    TipoServicio.findByIdAndRemove(id, (err, tipoServicioEliminado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: "Error al eliminar tipo de servicio",
                error: err
            });
        }
        if (!tipoServicioEliminado) {

            return res.status(404).json({
                exito: false,
                mensaje: "El servicio no existe"
            });

        }
        res.status(200).json({
            exito: true,
            mensaje: "Éxito al eliminar el servicio",
            tipoServicio: tipoServicioEliminado
        });


    });

});

app.get("/", (req, res) => {
    var empresa = req.query.empresa;
    var where = {};
    if (typeof empresa !== 'undefined') {
        where.empresa = empresa;
    }

    TipoServicio.find(where)
        .populate("empresa")
        .exec((err, tiposServicios) => {

            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error interno",
                    error: err
                });
            }
            if (tiposServicios.length <= 0) {

                return res.status(404).json({
                    exito: false,
                    mensaje: "Sin registros"
                });

            }

            TipoServicio.count((e, total) => {

                if (e) {
                    return res.status(400).json({
                        exito: false,
                        mensaje: "Error interno",
                        error: e
                    })
                }
                res.status(200).json({
                    exito: true,
                    mensaje: "Éxito en consulta",
                    tiposServicios: tiposServicios,
                    total: total
                });
            })
        });
});

app.get("/:id", (req, res) => {

    var id = req.params.id;
    TipoServicio.findById(id)
        .populate('empresa')
        .exec((err, tipoServicio) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error interno",
                    error: e
                });
            }
            if (!tipoServicio) {
                return res.status(404).json({
                    exito: false,
                    mensaje: "No se encontro ningun registro",
                    error: e
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: "Consulta exitosa",
                tipoServicio: tipoServicio
            });

        });

});

module.exports = app;