

const bcrypt = require('bcrypt');
const exitsGlobal = require('../../constants/exits'); // import global exits

/**
 * @swagger
 * /create-user:
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     description: Create a new user with name, email, password and optional fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: "User's full name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *                 description: "User's email address"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *                 description: "User's password (minimum 6 characters)"
 *               description:
 *                 type: string
 *                 example: "Software developer"
 *                 description: "Optional user description"
 *               age:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *                 description: "User's age"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
module.exports = {
  friendlyName: 'Create user',
  description: 'Create a new user',

  inputs: {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, isEmail: true },
    password: { type: 'string', required: true, minLength: 6 },
    description: { type: 'string', allowNull: true },
    age: { type: 'number', allowNull: true, min: 0 }
  },

  exits: exitsGlobal,

  fn: async function (inputs, exits) {
    try {
      // Kiểm tra email đã tồn tại chưa
     try {
        await sails.helpers.validateUserExists.with({
          email: inputs.email,
          shouldExist: true, // kiểm tra user có tồn tại hay không
        });
      } catch (err) {
        if (err.exit === 'emailExists') {
          return exits.conflict({ message: 'Email already exists' });
        }
        throw err; // ném lại lỗi khác
      }

      // Hash password trước khi lưu
      const hashedPassword = await UserServices.hashPassword(inputs.password);

      // Tạo UUID cho user
      const id = await sails.helpers.generateUuid();
      // Tạo user mới
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
      console.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};
