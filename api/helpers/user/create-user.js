

module.exports = {
    friendlyName: 'create new user',
    description: 'Create a new user with the provided details.',
 
    inputs: {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, isEmail: true },
    password: { type: 'string', required: true, minLength: 6 },
    age: { type: 'number', required: false, min: 0 },
    description: { type: 'string', required: false }
  },
  exits: {
    success: {
        description: 'User created successfully.',
        },
    fail:{
        description: 'Failed to create user.',
    }

 },
    fn: async function (inputs, exits) {
        try {
            // Kiểm tra email đã tồn tại chưa
     try {
        await sails.helpers.user.validateUserExists.with({
          email: inputs.email,
          shouldExist: true, // kiểm tra user có tồn tại hay không
        });
      } catch (err) {
        if (err.exit === 'emailExists') {
          return exits.conflict({ message: 'Email already exists' });
        }
        throw err; // ném lại lỗi khác
      }
        const hashedPassword = await sails.helpers.user.hashPassword.with({
            password: inputs.password
        });
        // Tạo UUID cho user
        const id = await sails.helpers.utils.generateUuid();
         const newUser = await User.create({
            id,
            name: inputs.name,
            email: inputs.email,
            password: hashedPassword,
            description: inputs.description,
            age: inputs.age
        }).fetch();

        return exits.success({ user: newUser });
        } catch (error) {
            sails.log.error('Error creating user:', error);
            return exits.fail({ message: error.message });
        }
    }
}

    