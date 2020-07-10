const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es necesaria'],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único.'});


module.exports = mongoose.model('Categoria', categoriaSchema);