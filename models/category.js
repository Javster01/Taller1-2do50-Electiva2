const mongoose = require('mongoose');
const { Schema } = mongoose;

const schemaCategory = new Schema({
  name: {
    type: String,
    required: true, // Este campo es obligatorio
  },
  description: {
    type: String,
    default: '', // Valor por defecto si no se proporciona una descripción
    trim: true,  // Elimina espacios en blanco al inicio y al final de la cadena
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId, // Relación con documentos en otra colección
      ref: 'Product', // Especifica que la relación es con el modelo 'Product'
    },
  ],
});

module.exports = mongoose.model('Category', schemaCategory);
