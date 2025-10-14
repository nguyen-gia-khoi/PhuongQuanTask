const bcrypt = require('bcryptjs');

module.exports = {
  friendlyName: 'Compare password',
  description: 'Compare a plain text password with a hashed password using bcrypt.',

  inputs: {
    password: { type: 'string', required: true },
    hash: { type: 'string', required: true },
  },

  

  fn: async function (inputs) {
    try {
      const isMatch = await bcrypt.compare(inputs.password, inputs.hash);
      if (!isMatch) {
        const error = new Error('Invalid password');
        error.code = 'ERROR20';
        throw error;
      }
      return true;
    } catch (err) {
      if (err.code) throw err;
      
      const error = new Error('Error comparing password');
      error.code = 'ERROR99';
      throw error;
    }
  }
};
