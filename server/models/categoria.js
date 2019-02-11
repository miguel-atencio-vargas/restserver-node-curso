const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true

    },
    description: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario que esta creando es requerido']
    },
    state: {
        type: Boolean,
        default: true
    }
});
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});
module.exports = mongoose.model('Categoria', categoriaSchema);