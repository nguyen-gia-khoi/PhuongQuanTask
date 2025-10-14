// api/helpers/category/update-category.js
const _ = require('lodash');

module.exports = {
  friendlyName: 'Update category',
  description: 'Update a category by code',

  inputs: {
    data: {
      type: 'ref',
      required: true,
      description: 'Object containing code (to find) and fields to update'
    }
  },

  fn: async function (inputs) {
    try {
      const { code } = inputs.data || {};

      // code bắt buộc để tìm bản ghi cần update
      if (!code || String(code).trim() === '') {
        const error = new Error('Missing required field: code');
        error.code = 'ERROR40';
        throw error;
      }

      const normalizedCode = String(code).trim().toUpperCase();

      // Đảm bảo category với code này tồn tại
      await sails.helpers.utils.checkCodeExists.with({
        model: 'category',
        code: normalizedCode,
        shouldExist: true,
        normalize: false
      });

      // Build update payload từ các trường được phép (không bao gồm code và id)
      const allowedKeys = ['name', 'status', 'type', 'description', 'note'];
      const toUpdate = _.pickBy(_.pick(inputs.data, allowedKeys), _.identity);

      if (_.isEmpty(toUpdate)) {
        const error = new Error('No valid fields to update');
        error.code = 'ERROR40';
        throw error;
      }

      // Nếu update name, kiểm tra name CHƯA tồn tại (unique)
      if (toUpdate.name) {
        const trimmedName = String(toUpdate.name).trim();
        
        // Kiểm tra name không được trùng với category khác
        await sails.helpers.utils.checkNameExists.with({
          model: 'category',
          name: trimmedName,
          shouldExist: false,  // name KHÔNG được tồn tại
          normalize: false
        });
        
        toUpdate.name = trimmedName;
      }

      // Validate status/type nếu có trong payload
      const validStatus = [0, 1, 2];
      const validType = [0, 1];

      if (toUpdate.status !== undefined) {
        const s = Number(toUpdate.status);
        if (!validStatus.includes(s)) {
          const error = new Error('Invalid input format');
          error.code = 'ERROR41';
          throw error;
        }
        toUpdate.status = s;
      }

      if (toUpdate.type !== undefined) {
        const t = Number(toUpdate.type);
        if (!validType.includes(t)) {
          const error = new Error('Invalid input format');
          error.code = 'ERROR41';
          throw error;
        }
        toUpdate.type = t;
      }

      // Update category
      const updatedCategory = await sails.models.category.updateOne({ code: normalizedCode }).set(toUpdate);

      if (!updatedCategory) {
        const error = new Error('Category not found');
        error.code = 'ERROR01';
        throw error;
      }

      // Loại id khỏi response nếu muốn
      const { id, ...sanitized } = updatedCategory;

      return {
        message: 'Category updated successfully',
        data: sanitized
      };
    } catch (err) {
      sails.log.error('Error in update-category helper:', err);
      if (err.code) throw err;

      const error = new Error(err.message || 'Failed to update category');
      error.code = 'ERROR99';
      throw error;
    }
  }
};