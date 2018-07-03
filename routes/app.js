var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        exitoso: true,
        mensaje: "Petición Home exitosa"

    });
});

module.exports = app;