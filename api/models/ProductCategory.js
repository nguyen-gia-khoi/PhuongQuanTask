module.exports = {
  tableName: 'product_category',
  attributes: {
    id: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    code: { type: 'string', required: true, unique: true },
    status: { type: 'number', defaultsTo: 1 },
    type: { type: 'number', defaultsTo: 0 },
    description: { type: 'string', allowNull: true },
    note: { type: 'string', allowNull: true },

    // FK đến Product
    product: {
      model: 'product',
      required: true
    },

    // FK đến Category
    category: {
      model: 'category',
      required: true
    },
  },
};
