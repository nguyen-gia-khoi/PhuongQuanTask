const bcrypt = require('bcryptjs');

module.exports = {
  attributes: {
    id: { type: 'string', columnName: 'id', required: true, unique: true },
    name: { type: 'string', required: true },
    email: { type: 'string', isEmail: true, required: true, unique: true },
    password: { type: 'string', required: true },
    description: { type: 'string' },
    age: { type: 'number', min: 0 },
    status: { type: 'string', isIn: ['active', 'inactive'], defaultsTo: 'active' },
  },

  beforeCreate: async function (valuesToSet, proceed) {
    try {
      if (valuesToSet.password) {
        const salt = await bcrypt.genSalt(10);
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, salt);
      }
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },

  beforeUpdate: async function (valuesToSet, proceed) {
    try {
      if (valuesToSet.password) {
        const salt = await bcrypt.genSalt(10);
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, salt);
      }
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
};
