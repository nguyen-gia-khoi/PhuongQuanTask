module.exports = {
  tableName: 'productcategory',
  attributes: {
    id: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    code: { type: 'string', required: true, unique: true },
    status: { type: 'number', isIn: [0, 1, 2], defaultsTo: 0,description: '0: active, 1: inactive, 2: deleted' },
    type: { type: 'number', defaultsTo: 0,description: '0: normal' },
    description: { type: 'string', allowNull: true },
    note: { type: 'string', allowNull: true },

     product: {
      model: 'product',
      required: true
    },

    category: {
      model: 'category',
      required: true
    },
  },
};
