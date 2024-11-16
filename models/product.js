const mongoose = require('mongoose');
const { Schema } = mongoose;

const schemaProduct = new Schema({
  name: {
    type: String,
    required: true, // Campo obligatorio
  },
  description: {
    type: String,
    default: '', // Descripción opcional con un valor por defecto vacío
    trim: true,  // Elimina espacios innecesarios al inicio y al final
  },
  value: {
    type: Number,
    required: [true, 'El valor es requerido'], // Campo obligatorio con mensaje de error personalizado
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Relación con otro documento en MongoDB
    ref: 'Category', // Especifica que la relación es con el modelo 'Category'
  },
});

module.exports = mongoose.model('Product', schemaProduct);
