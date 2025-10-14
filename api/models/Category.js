
module.exports = {
  attributes: {
    id: { type: 'string', columnName: 'id', required: true, unique: true },
    name: { type: 'string', required: true, unique: true },
    code: { type: 'string', required: true,unique: true },
    status: { type: 'number', isIn: [0, 1, 2], defaultsTo: 0 },
    type: { type: 'number', isIn: [0, 1], defaultsTo: 0 },
    description: { type: 'string' },
    note: { type: 'string' },
  },

};
