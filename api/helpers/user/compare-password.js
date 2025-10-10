const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Compare password',
  description: 'Compare a plain text password with a hashed password using bcrypt.',

  inputs: {
    password: { type: 'string', required: true },
    hash: { type: 'string', required: true },
  },

  exits: {
    success: { description: 'Password comparison completed successfully.' },
  },

  fn: async function (inputs, exits) {
    const isMatch = await bcrypt.compare(inputs.password, inputs.hash);
    return exits.success(isMatch);
  },
};
