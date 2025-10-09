const exitsGlobal = require('../../constants/exits');

module.exports = {
  friendlyName: 'Delete user',
  description: 'Delete a user by email',

  inputs: {
    email: { type: 'string', required: true }
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
      await User.destroyOne({ email: inputs.email });
      return exits.success({ message: 'User deleted successfully' });

    } catch (error) {
      sails.log.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};