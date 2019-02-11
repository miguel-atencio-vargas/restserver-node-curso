const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
/* Modificamos el metodo toJson con el fin de borrar un atributo del esquema
Notar que el metodo toJson siempre se llama cuando se intenta imprimir.
Aqui tenemos que usar la funcion normal sin que sea de flecha, porque necesitamos el this.*/
// En otras palabras quitamos la prop password cuando el objeto quiera pasarse a json
usuarioSchema.methods.toJSON = function() {
        // agarramos el valor de lo que sea que tenga en ese momento
        let user = this;
        // tomamos el objeto de ese usuario
        let userObject = user.toObject();
        //eliminamos la propiedad
        delete userObject.password;
        return userObject;
    }
    /* de manera similar podemos agregar metodos al esquema cuando nosotros hacemos
    modificaciones a los objetos en javascript*/

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);