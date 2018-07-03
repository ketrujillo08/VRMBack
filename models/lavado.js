var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var lavadoSchema = new Schema({
    carro: { type: Schema.Types.ObjectId, ref: 'Carro', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    servicio: { type: Schema.Types.ObjectId, ref: 'TipoServicio', required: true },
    empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    creador: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    lluvia: { type: Boolean, required: true },
    tapete: { type: Boolean, required: true },
    aroma: { type: Boolean, required: true },
    precio: { type: Number, required: true },
    lavador: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: Schema.Types.ObjectId, ref: 'Estado', required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true }
});

module.exports = mongoose.model('Lavado', lavadoSchema);