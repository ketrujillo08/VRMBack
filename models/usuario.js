var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN', 'Gerente', 'Supervisor', 'Auxiliar', 'Cliente'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    correo: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    rol: { type: String, default: 'Cliente', required: true, enum: rolesValidos },
    empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: false },
    fecha: { type: Date, default: Date.now, required: true },
    activo: { type: Number, required: true, default: 1 },
    imagen: { type: String, required: false },
    google: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe ser unico.' });

module.exports = mongoose.model('Usuario', usuarioSchema);