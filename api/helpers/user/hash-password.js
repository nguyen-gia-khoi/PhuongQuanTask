module.exports = {
  friendlyName: 'Hash password',
  description: 'Hash a password using bcrypt.',

  inputs: {
    password: {
      type: 'string',
      required: true,
      description: 'The password to hash.',
    },
  },

  exits: {
    success: {
      description: 'Password hashed successfully.',
    },
  },

  fn: async function (inputs, exits) {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputs.password, salt);
    return exits.success(hashedPassword);
  },
};
