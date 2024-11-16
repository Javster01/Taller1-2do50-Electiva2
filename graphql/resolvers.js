const Product = require('../models/product');
const Category = require('../models/category');

const resolvers = {
  Query: {
    getProducts: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Not authenticated'); // Bloquea el acceso si no está autenticado
      }

      try {
        return await Product.find().populate('category');
      } catch (err) {
        throw new Error(`Error fetching products: ${err.message}`);
      }
    },
    getProductById: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const product = await Product.findById(id).populate('category');
        if (!product) throw new Error(`Product with ID ${id} not found`);
        return product;
      } catch (err) {
        throw new Error(`Error fetching product: ${err.message}`);
      }
    },
    getCategories: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        return await Category.find().populate('products');
      } catch (err) {
        throw new Error(`Error fetching categories: ${err.message}`);
      }
    },
    getCategoryById: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const category = await Category.findById(id).populate('products');
        if (!category) throw new Error(`Category with ID ${id} not found`);
        return category;
      } catch (err) {
        throw new Error(`Error fetching category: ${err.message}`);
      }
    },
  },
  Mutation: {
    addProduct: async (_, { name, description, value, category }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const existingCategory = await Category.findById(category);
        if (!existingCategory) throw new Error('Category not found');

        const newProduct = new Product({ name, description, value, category });
        const savedProduct = await newProduct.save();
        existingCategory.products.push(savedProduct._id);
        await existingCategory.save();

        return savedProduct;
      } catch (err) {
        throw new Error(`Error adding product: ${err.message}`);
      }
    },
    updateProduct: async (_, { id, name, description, value, category }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, description, value, category },
          { new: true }
        ).populate('category');
        if (!updatedProduct) throw new Error(`Product with ID ${id} not found`);

        return updatedProduct;
      } catch (err) {
        throw new Error(`Error updating product: ${err.message}`);
      }
    },
    deleteProduct: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) throw new Error(`Product with ID ${id} not found`);

        await Category.updateMany({ products: id }, { $pull: { products: id } });

        return { message: `Product with ID ${id} deleted successfully` };
      } catch (err) {
        throw new Error(`Error deleting product: ${err.message}`);
      }
    },
    addCategory: async (_, { name, description }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const newCategory = new Category({ name, description });
        return await newCategory.save();
      } catch (err) {
        throw new Error(`Error adding category: ${err.message}`);
      }
    },
    updateCategory: async (_, { id, name, description }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { name, description },
          { new: true }
        );
        if (!updatedCategory) throw new Error(`Category with ID ${id} not found`);

        return updatedCategory;
      } catch (err) {
        throw new Error(`Error updating category: ${err.message}`);
      }
    },
    deleteCategory: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) throw new Error(`Category with ID ${id} not found`);

        await Product.updateMany({ category: id }, { $unset: { category: '' } });

        return { message: `Category with ID ${id} deleted successfully` };
      } catch (err) {
        throw new Error(`Error deleting category: ${err.message}`);
      }
    },
  },
};

module.exports = resolvers;
