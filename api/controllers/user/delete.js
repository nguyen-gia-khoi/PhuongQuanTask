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
      const result = await sails.helpers.user.destroyUser.with({ email: inputs.email });
      return exits.success(result);
    } catch (error) {
      sails.log.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};