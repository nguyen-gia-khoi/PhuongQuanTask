// api/controllers/user/create-user.js
module.exports = {
  friendlyName: 'Create user',
  description: 'Create a new user',

  fn: async function () {
    try {
      // Gọi helper với inputs
      const result = await sails.helpers.user.createUser.with({
        data: this.req.body
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