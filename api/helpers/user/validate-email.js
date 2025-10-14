// module.exports = {
//   friendlyName: 'Validate user exists',

//   description: 'Check if a user with a given email already exists or not.',

//   inputs: {
//     email: { type: 'string', required: true },
//     shouldExist: { type: 'boolean', defaultsTo: true }, 
//     // true = kiểm tra có tồn tại (dùng khi tạo user)
//     // false = kiểm tra không tồn tại (dùng khi xóa user)
//   },

//   exits: {
//     emailExists: {
//       description: 'User with this email already exists.',
//     },
//     userNotFound: {
//       description: 'No user found with this email.',
//     },
//   },

//   fn: async function (inputs, exits) {
//     const user = await User.findOne({ email: inputs.email });

//     if (inputs.shouldExist) {
//       // 🧩 Dùng khi cần check "phải chưa tồn tại" (ví dụ: create user)
//       if (user) return exits.emailExists({ message: 'Email already exists' });
//       return exits.success();
//     } else {
//       // 🧩 Dùng khi cần check "phải tồn tại" (ví dụ: delete user)
//       if (!user) return exits.userNotFound({ message: 'User not found' });
//       return exits.success();
//     }
//   }
// };



module.exports = {
  friendlyName: 'Validate email',
  description: 'Check if an email is valid format',

  inputs: {
    email: { type: 'string', required: true }
  },

  fn: async function (inputs) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      const error = new Error('Email không hợp lệ');
      error.code = 'ERROR03';  
      throw error;
    }
    return true;
  }
};
