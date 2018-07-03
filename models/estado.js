var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estadoSchema = new Schema({
    estado: { type: String, required: [true, 'El estado del servicio es necesario'] },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: "Empresa" },
    activo: { type: Boolean, required: false }
});

module.exports = mongoose.model('Estado', estadoSchema);