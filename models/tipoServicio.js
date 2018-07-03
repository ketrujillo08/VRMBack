var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipoServicioSchema = new Schema({
    servicio: { type: String, required: [true, 'El nombre del servicio es necesario'] },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: "Empresa" },
    activo: { type: Boolean, required: false }
});

module.exports = mongoose.model('TipoServicio', tipoServicioSchema);