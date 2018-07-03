var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de la empresa es valido'] },
    fecha: { type: Date, required: true, default: Date.now },
    activo: { type: Boolean, required: false }
});

module.exports = mongoose.model('Empresa', empresaSchema);