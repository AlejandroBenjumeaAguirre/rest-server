const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let productoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'], unique: true},
    precioUni: { type: Number, required: [true, 'El precio es requerido']},
    descripcion: { type: String, required: false},
    disponibilidad: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria'},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario'}

});


module.exports = mongoose.model('Producto', productoSchema);