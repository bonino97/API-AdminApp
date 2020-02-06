var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un Rol permitido '
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'Nombre Requerido.'] },
    email: { type: String, unique:true, required: [true, 'Email Requerido.'] },
    password: { type: String, required: [true, 'Contraseña Requerida.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin( uniqueValidator, {message: '{PATH} en uso '} )

module.exports = mongoose.model('Usuario', usuarioSchema);