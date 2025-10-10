const { description } = require("./compare-password");

module.exports = {
    friendlyName: 'Update user',
    description: 'Update user by email',
    inputs: {
      email: { type: 'string', required: true },
      name: { type: 'string', required: false },
      age: { type: 'number', required: false, min: 0 },
      description: { type: 'string', required: false }
    },
    exits: {
        success: { description: 'User updated successfully.' },
        fail: { description: 'Failed to update user.' },
        notFound: { description: 'User not found.' }
    },
    fn: async function (inputs, exits) {
      sails.log.info('>>> helpers.user =', sails.helpers.user);
      try {
          try {
            await sails.helpers.user.validateUserExists.with({ email: inputs.email, shouldExist: false });
        } catch (err) {
            if( err.exit === 'userNotFound') {
            return exits.notFound({ message: 'User not found' });
            }
            throw err;
        }
        const updatedUser = await User.updateOne({ email: inputs.email }).set({
        name: inputs.name, description: inputs.description, age: inputs.age});
        return exits.success({ user: updatedUser });
      } catch (error) {
        sails.log.error('Error updating user:', error);
        return exits.fail({ message: error.message });
      }
    }
}