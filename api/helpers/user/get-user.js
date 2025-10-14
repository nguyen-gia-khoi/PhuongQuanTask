const _ = require('lodash');

module.exports = {
  friendlyName: 'Get users',
  description: 'Get all users from the database.',

  inputs: {
    data: {
      type: 'ref', 
      required: true,
      description: 'Object containing user data (name, email, password, etc)'
    }
  },

  fn: async function (inputs) {
    try {
      const { 
        name, 
        email, 
        age ,
        page=1,
        limit=10,
        
      } = inputs.data || {};
      
      if (email) {
        await sails.helpers.user.validateEmail.with({
          email: email  // ← Dùng email từ data
        });
        await sails.helpers.user.checkEmailExits.with({
          email: email,
          shouldExist: true  // ← Email PHẢI tồn tại
        });
      }
      
      
      
      const skip = (page - 1) * limit;

      const filter = _.pickBy(
        _.pick(inputs.data, ['age', 'email', 'description','name']),
        _.identity
      );
      
      const totalUsers = await sails.models.user.count({ where: filter });

      const users = await sails.models.user.find({
        where: filter,
        sort: 'createdAt DESC',
        skip,
        limit: limit,
      });

      if (!users || users.length === 0) {
        const error = new Error('No users found');
        error.code = 'ERROR01'; 
        throw error;
      }

      const sanitized = users.map(({ id, password, ...rest }) => rest);

      return {
        total: totalUsers,
        page: inputs.page,
        limit: inputs.limit,
        data: sanitized,
      };
    } catch (err) {
      if (!err.code) {
        const error = new Error(err.message || 'Internal server error');
        error.code = 'ERROR99';  // Sửa ERR500 → ERROR99 cho đồng bộ
        throw error;
      }
      throw err;
    }
  },
};