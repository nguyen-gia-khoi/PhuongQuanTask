
module.exports = {
  friendlyName: 'Update user',
  description: 'Update a user by email',

  inputs: {
    email: { type: 'string', required: true },
    name: { type: 'string', allowNull: true },
    description: { type: 'string', allowNull: true },
    age: { type: 'number', allowNull: true },
    status: { type: 'string', allowNull: true }
  },

  fn: async function (inputs) {
    try {
      const result = await sails.helpers.user.update.with({ data: inputs });
      return this.res.success(result);
    } catch (err) {
      sails.log.error('Error in update-user:', err);
      if (err.code) {
        return this.res.fail(err.code);
      }
      return this.res.fail('ERROR99');
    }
  }
};