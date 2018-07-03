var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var carrosSchema = new Schema({
    modelo: { type: String, required: [true, "El modelo es necesario"] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, "El usuario es necesario"] },
    creador: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, "El creador es necesario"] },
    placas: { type: String, required: false, unique: true },
    anio: { type: Number, required: false },
    color: { type: String, required: true },
    comentarios: { type: String, required: false }
});

carrosSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe ser unico.' });

module.exports = mongoose.model('Carro', carrosSchema);