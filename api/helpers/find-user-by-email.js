module.exports = {
  friendlyName: 'Find user by email',

  description: 'Find a user in the database by email address.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      description: 'The email address of the user to find.',
    },
  },

  exits: {
    notFound: {
      description: 'No user with this email exists.',
    },
    success: {
      description: 'User found successfully.',
    },
  },

  fn: async function (inputs, exits) {
    const user = await User.findOne({ email: inputs.email });

    if (!user) {
      return exits.notFound({ message: 'User not found' });
    }

    return exits.success(user);
  }
};
