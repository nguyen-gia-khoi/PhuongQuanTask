
module.exports = {
  friendlyName: 'Create new user',
  description: 'Create a new user with the provided details.',

  inputs: {
    data: {
      type: 'ref',  // ✅ Nhận object từ controller
      required: true,
      description: 'Object containing user data (name, email, password, etc)'
    }
  },

  fn: async function (inputs) {
    try {
      // ✅ Destructure data từ inputs.data
      const { 
        name, 
        email, 
        password,
        role, 
        description, 
        age 
      } = inputs.data || {};
      
      // ✅ Validate email formats
      await sails.helpers.user.validateEmail.with({
        email: email  // ← Dùng email từ data
      });
      
      // ✅ Check email exists
      await sails.helpers.user.checkEmailExits.with({
        email: email  // ← Dùng email từ data
      });


      // ✅ Generate UUID
      const id = await sails.helpers.utils.generateUuid();

      // ✅ Create user với data đã validate
      const newUser = await User.create({
        id,
        name,        // ← Dùng name từ data
        email,       // ← Dùng email từ data
        password,    // Let model hook hash it
        role,
        description, // ← Dùng description từ data (nếu có)
        age         // ← Dùng age từ data (nếu có)
      }).fetch();

      // ✅ Remove sensitive data
      const { password: _, ...sanitizedUser } = newUser;

      // ✅ Return user data
      return {
        user: sanitizedUser
      };

    } catch (err) {
      sails.log.error('Error in createUser helper:', err);

      // ✅ Throw error với code
      if (err.code) {
        throw err;
      }

      // ✅ Generic error
      const error = new Error(err.message || 'Failed to create user');
      error.code = 'ERROR99';
      throw error;
    }
  }
};