const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Generate JWT token',

  description: 'Generate a JWT access token for a user',

  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'The user object used to sign the token (must include id, email, etc.)',
    },
  },

  exits: {
    success: {
      description: 'Token generated successfully',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const payload = {
        sub: inputs.user.id,
        email: inputs.user.email,
        status: inputs.user.status || 'active',
      };

      const token = jwt.sign(payload, sails.config.custom.jwtSecret, {
        expiresIn: sails.config.custom.jwtExpiresIn || '1d',
      });

      return exits.success(token);
    } catch (error) {
      return exits.error(error);
    }
  },
};
