
const jwt = require('jsonwebtoken');
const exitsGlobal = require('../../constants/exits');

module.exports = {
  friendlyName: 'Sign in',
  description: 'Sign in with email and password',

  inputs: {
    email: { type: 'string', required: true, isEmail: true },
    password: { type: 'string', required: true }
  },

  exits: exitsGlobal,

  fn: async function (inputs, exits) {
    try {
      
      try {
        await sails.helpers.validateUserExists.with({ email: inputs.email, shouldExist: false });
      } catch (err) {
        if( err.exit === 'userNotFound') {
          return exits.notFound({ message: 'User not found' });
       }
      }
      
      const user = await sails.helpers.findUserByEmail.with({ email: inputs.email });

      const ok = await UserServices.comparePassword(inputs.password, user.password);
      if (!ok) {
        return exits.validationError({ reason: 'invalid_credentials' });
      }

      const token = await sails.helpers.generateToken.with({ user });
      return exits.success({ token });
    } catch (error) {
      sails.log.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};