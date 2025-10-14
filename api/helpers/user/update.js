const _ = require('lodash');

module.exports = {
    friendlyName: 'Update user',
    description: 'Update user by email',
    inputs: {
      data: {
        type: 'ref',
        required: true,
        description: 'Object containing email and fields to update'
      }
    },
    fn: async function (inputs) {
      try {
        const { email } = inputs.data || {};

        // Validate required email
        if (!email) {
          const error = new Error('Email is required');
          error.code = 'ERROR40';
          throw error;
        }

        // Validate email format
        await sails.helpers.user.validateEmail.with({ email });

        // Ensure user exists
        await sails.helpers.user.checkEmailExits.with({
          email,
          shouldExist: true
        });

        // Build update fields from allowed keys only
        const allowedKeys = ['name', 'description', 'age', 'status'];
        const toUpdate = _.pickBy(_.pick(inputs.data, allowedKeys), _.identity);

        if (_.isEmpty(toUpdate)) {
          const error = new Error('No valid fields to update');
          error.code = 'ERROR40';
          throw error;
        }

        const updatedUser = await sails.models.user.updateOne({ email }).set(toUpdate);

        if (!updatedUser) {
          const error = new Error('User not found');
          error.code = 'ERROR01';
          throw error;
        }

        const { password, ...sanitized } = updatedUser;

        return {
          message: 'User updated successfully',
          data: sanitized
        };
      } catch (err) {
        sails.log.error('Error updating user:', err);
        if (err.code) {
          throw err;
        }
        const error = new Error(err.message || 'Failed to update user');
        error.code = 'ERROR99';
        throw error;
      }
    }
}