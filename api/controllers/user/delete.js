module.exports = {
  friendlyName: 'Delete user',
  description: 'Delete a user by email',

  inputs: {
    email: { type: 'string', required: true }
  },

  fn: async function (inputs) {
    try {
      const result = await sails.helpers.user.destroyUser.with({ email: inputs.email });
      return this.res.success(result);
    } catch (err) {
      sails.log.error('Error in delete users:', err);

      if (err.code) {
        return this.res.fail(err.code);
      }

      return this.res.fail('ERROR99');
    }
  }
};