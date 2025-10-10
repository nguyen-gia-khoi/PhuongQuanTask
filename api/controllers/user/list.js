const exitsGlobal = require('../../constants/exits');

module.exports = {
  friendlyName: 'List users',
  description: 'Retrieve a list of all users. This endpoint allows you to fetch user details such as name, email, description, age, and status. Results are sorted by creation date in descending order. Use query parameters like "limit" or "skip" for pagination. Excludes sensitive fields like "id" and "password" from the response.',
   inputs: {
    page: {
      type: 'number',
      defaultsTo: 1,
      description: 'Trang hiện tại',
    },
    limit: {
      type: 'number',
      defaultsTo: 10,
      description: 'Số lượng user trên mỗi trang',
    },
  },

  exits: exitsGlobal,

  fn: async function (inputs, exits) {
    try {
       const result = await sails.helpers.user.getUser.with({
        page: inputs.page,
        limit: inputs.limit,
      });
      
      const sanitized = result.data.map(({ id, password, ...rest }) => rest);

      return exits.success({ 
        total:result.total,
        page: result.page,
        limit: result.limit,
        users: sanitized });
    } catch (error) {
      sails.log.error(error);
      return exits.serverError({ error: error.message });
    }
  }
};