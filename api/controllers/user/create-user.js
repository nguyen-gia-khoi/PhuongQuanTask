
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
const exitsGlobal = require('../../constants/exits'); // import global exits


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
      
      const newUser = await sails.helpers.user.createUser.with({
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        description: inputs.description,
        age: inputs.age
      });
      return exits.success({ newUser });
    } catch (error) {
      console.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};
