var express = require('express');
var bcrypt = require('bcryptjs');
var jsonwebtoken = require('jsonwebtoken');
var Usuario = require('../models/usuario');
var config = require('../config/config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);

var app = express();


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log("PayLoad", payload);
    return payload;
}

app.post('/google', async(req, res, next) => {
    var token = req.body.token || 'xxx';
    var googleUser = await verify(token).catch(err => {
        console.log("Razones", err);
        return res.status(500).json({
            exito: false,
            error: err
        });
    });
    Usuario.findOne({ correo: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error en la consulta',
                error: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    exito: false,
                    mensaje: 'Usuario Existen'
                });

            } else {
                var token = jsonwebtoken.sign(usuarioDB, config.SEED, { expiresIn: 14400 });
                return res.status(200).json({
                    exito: true,
                    token: token,
                    usuario: usuarioDB,
                    id: usuarioDB._id
                });

            }
        } else {
            var usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.apellido = googleUser.name;
            usuario.email = googleUser.email;
            usuario.password = 'stuSBa9AM1';
            usuario.imagen = googleUser.imagen;
            usuario.google = true;
            usuario.rol = 'Cliente';
            usuario.fecha = Date();
            usuario.activo = 1;

            usuario.save((err, nuevoUsuario) => {
                if (err) {
                    return res.status(400).json({
                        exito: false,
                        mensaje: 'Error interno',
                        error: err
                    });
                }
                var token = jsonwebtoken.sign(nuevoUsuario, config.SEED, { expiresIn: 14400 });
                res.status(200).json({
                    exito: true,
                    mensaje: "Usuario creado con Google",
                    usuario: nuevoUsuario,
                    token: token,
                    id: nuevoUsuario._id


                });
            });
        }

    });
});
app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error en el servidor',
                error: err
            });
        }
        if (usuarioDB.length <= 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Datos incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Datos incorrectos'
            });
        }
        var token = jsonwebtoken.sign({ usuario: usuarioDB }, config.SEED, { expiresIn: 144000 });
        usuarioDB.password = undefined;
        res.status(200).json({
            exito: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
                //Retonar Menu del usuario
        });
    });
});

module.exports = app;