// api/helpers/user/check-email-exits.js
module.exports = {
    friendlyName: 'Check email exists',
    description: 'Check if a user with given email exists in database',
  
    inputs: {
      email: {
        type: 'string',
        required: true,
        description: 'Email address to check'
      },
      shouldExist: {
        type: 'boolean',
        defaultsTo: false,
        description: 'true = phải tồn tại, false = không được tồn tại'
      }
    },
  
    fn: async function (inputs) {
      const user = await sails.models.user.findOne({ email: inputs.email });
  
      // Case 1: Kiểm tra email PHẢI tồn tại (dùng cho get/delete)
      if (inputs.shouldExist && !user) {
        const error = new Error(`Email ${inputs.email} không tồn tại`);
        error.code = 'ERROR01';  // User not found
        throw error;
      }
  
      // Case 2: Kiểm tra email KHÔNG được tồn tại (dùng cho create)
      if (!inputs.shouldExist && user) {
        const error = new Error(`Email ${inputs.email} đã tồn tại`);
        error.code = 'ERROR02';  // Email exists
        throw error;
      }
  
      // ✅ Pass validation
      return true;
    }
  };