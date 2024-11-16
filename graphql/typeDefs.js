const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Tipo Product
  type Product {
    id: ID!
    name: String!
    description: String
    value: Float!
    category: Category
  }

  # Tipo Category
  type Category {
    id: ID!
    name: String!
    description: String
    products: [Product]
  }

  # Consultas
  type Query {
    # Consultas para Product
    getProducts: [Product]
    getProductById(id: ID!): Product

    # Consultas para Category
    getCategories: [Category]
    getCategoryById(id: ID!): Category
  }

  # Mutaciones
  type Mutation {
    # Mutaciones para Product
    addProduct(name: String!, description: String, value: Float!, category: ID!): Product
    updateProduct(id: ID!, name: String, description: String, value: Float, category: ID): Product
    deleteProduct(id: ID!): String

    # Mutaciones para Category
    addCategory(name: String!, description: String): Category
    updateCategory(id: ID!, name: String, description: String): Category
    deleteCategory(id: ID!): String
  }
`;

module.exports = typeDefs;
