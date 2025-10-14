// api/helpers/category/get-category.js
const _ = require('lodash');

module.exports = {
  friendlyName: 'Get categories',
  description: 'Get all categories from the database with optional filters',

  inputs: {
    data: {
      type: 'ref',
      required: true,
      description: 'Object containing filter data (name, code, status, type, page, limit)'
    }
  },

  fn: async function (inputs) {
    try {
      const {
        name,
        code,
        status,
        type,
        page = 1,
        limit = 10,
      } = inputs.data || {};

      // Validate code nếu có truyền (optional: chỉ khi muốn bắt buộc tồn tại)
      // Với list, thường không cần check exists; chỉ filter
      // Nếu muốn bắt buộc tồn tại khi filter theo code:
      if (code) {
        await sails.helpers.utils.checkCodeExists.with({
          model: 'category',
          code: code,
          shouldExist: true,
          normalize: true
        });
      }

      // Validate name nếu có truyền (tương tự)
      if (name) {
        await sails.helpers.utils.checkNameExists.with({
          model: 'category',
          name: name,
          shouldExist: true,
          normalize: true
        });
      }

      const skip = (page - 1) * limit;

      // Build filter từ các trường được phép
      const filter = _.pickBy(
        _.pick(inputs.data, ['name', 'code', 'status', 'type']),
        _.identity
      );

      const totalCategories = await sails.models.category.count({ where: filter });

      const categories = await sails.models.category.find({
        where: filter,
        sort: 'createdAt DESC',
        skip,
        limit: limit,
      });

      if (!categories || categories.length === 0) {
        const error = new Error('No categories found');
        error.code = 'ERROR01';
        throw error;
      }

      // Loại bỏ id khỏi response (nếu muốn)
      const sanitized = categories.map(({ id, ...rest }) => rest);

      return {
        total: totalCategories,
        page: page,
        limit: limit,
        data: sanitized,
      };
    } catch (err) {
      sails.log.error('Error in get-category helper:', err);
      if (err.code) throw err;

      const error = new Error(err.message || 'Internal server error');
      error.code = 'ERROR99';
      throw error;
    }
  }
};