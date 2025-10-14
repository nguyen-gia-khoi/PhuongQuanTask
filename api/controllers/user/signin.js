// api/controllers/user/signin.js
const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Sign in',
  description: 'Sign in with email and password',

  inputs: {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
  },

  fn: async function (inputs) {
    try {
     

      // 1. Validate email format
      await sails.helpers.user.validateEmail.with({
        email: inputs.email
      });

      // 2. Check email PHẢI tồn tại
      await sails.helpers.user.checkEmailExits.with({
        email: inputs.email,
        shouldExist: true  // ✅ Email phải tồn tại
      });

      // 3. Get user
      const user = await sails.models.user.findOne({ 
        email: inputs.email 
      });    
      

      // 4. Compare password
      await sails.helpers.user.comparePassword.with({
        password: inputs.password,
        hash: user.password
      });

      // 5. Generate token
      const token = await sails.helpers.utils.generateToken.with({ user });

      // 6. Return success
      return this.res.success({
        message: 'Login successful',
        token: token
      });

    } catch (err) {
      sails.log.error('Error in signin:', err);

      if (err.code) {
        return this.res.fail(err.code);
      }

      return this.res.fail('ERROR99');  // Internal server error
    }
  }
};