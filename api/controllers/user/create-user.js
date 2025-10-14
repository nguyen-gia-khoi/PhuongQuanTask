// api/controllers/user/create-user.js
module.exports = {
  friendlyName: 'Create user',
  description: 'Create a new user',

  inputs: {
    name: { 
      type: 'string', 
      required: true,
      description: "User's full name"
    },
    email: { 
      type: 'string', 
      required: true,
      description: "User's email address"
    },
    password: { 
      type: 'string', 
      required: true, 
      minLength: 6,
      description: "User's password (minimum 6 characters)"
    },
    description: { 
      type: 'string',
      description: "Optional user description"
    },
    age: { 
      type: 'number',
      min: 0,
      max: 150,
      description: "User's age"
    }
  },

  fn: async function (inputs) {
    try {
      // Gọi helper với inputs
      const result = await sails.helpers.user.createUser.with({
        data: inputs
      });

      // Success response
      return this.res.success({
        data: result.user,
        message: 'User created successfully',
        status: 201
      });

    } catch (err) {
      sails.log.error('Error in create-user:', err);

      if (err.code) {
        return this.res.fail(err.code);
      }

      return this.res.fail('ERROR99');
    }
  }
};