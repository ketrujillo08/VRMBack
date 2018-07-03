var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('mongoose');

//Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var empresaRoutes = require('./routes/empresa');
var loginRoutes = require('./routes/login');
var carroRoutes = require('./routes/carro');
var tipoServicioRoutes = require('./routes/tipoServicio');
var estadoRoutes = require('./routes/estado');
var lavadoRoutes = require('./routes/lavado');
var app = express();


mongoose.connection.openUri('mongodb://localhost:27017/VRM', (err, res) => {
    if (err) {
        console.log(err)
    }
    console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS ');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/usuario', usuarioRoutes);
app.use('/empresa', empresaRoutes);
app.use('/login', loginRoutes);
app.use('/carro', carroRoutes);
app.use('/tipoServicio', tipoServicioRoutes);
app.use('/estado', estadoRoutes);
app.use('/lavado', lavadoRoutes);
app.use('/', appRoutes);

app.listen(config.PORT, () => {
    console.log("Bienvenido a VRM");
});