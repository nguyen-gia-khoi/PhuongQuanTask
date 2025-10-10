
/**
 * @swagger
 * /update-user:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by email
 *     operationId: deleteUserByEmail
 *     security:
 *       - bearerAuthorization: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string, format: email }
 *         example: "john@example.com"
 *     responses:
 *       200: { description: User deleted successfully }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: User not found }
 *       500: { description: Server error }
 */
const exitsGlobal = require('../../constants/exits');

module.exports = {
  friendlyName: 'Update user',
  description: 'Update a user by email',

  inputs: {
    email: { type: 'string', required: true },
    name: { type: 'string', allowNull: true },
    description: { type: 'string', allowNull: true },
    age: { type: 'number', allowNull: true }
  },

  exits: exitsGlobal,

  fn: async function (inputs, exits) {
    try {
      const result = await sails.helpers.user.update.with({ email: inputs.email, name: inputs.name, description: inputs.description, age: inputs.age });
      return exits.success(result);
    } catch (error) {
      sails.log.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};