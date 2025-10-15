module.exports = {
  friendlyName: 'Check relation exists',
  description: 'Kiểm tra xem một bản ghi có đang được tham chiếu ở các model khác không',

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Tên model gốc (ví dụ: product, category, user, ...)',
    },
    code: {
      type: 'string',
      required: true,
      description: 'Code hoặc ID của bản ghi cần kiểm tra',
    },
    relations: {
      type: 'ref',
      required: true,
      description: 'Danh sách các model liên quan cần kiểm tra, dạng [{model, field, label}]',
    },
  },

  fn: async function (inputs) {
    const { model, code, relations } = inputs;

    try {
      // ✅ Chuẩn hóa code
      const normalizedCode = String(code).trim().toUpperCase();

      // ✅ Kiểm tra model chính tồn tại
      if (!sails.models[model]) {
        const error = new Error(`Model "${model}" does not exist`);
        error.code = 'ERROR_MODEL_NOT_FOUND';
        throw error;
      }

      // ✅ Kiểm tra bản ghi tồn tại
      const record = await sails.models[model].findOne({ code: normalizedCode });
      if (!record) {
        const error = new Error(`${model} not found`);
        error.code = 'ERROR_NOT_FOUND';
        throw error;
      }

      // ✅ Kiểm tra các quan hệ
      for (const relation of relations) {
        const { model: relModel, field, label } = relation;

        if (!sails.models[relModel]) continue; // Bỏ qua nếu model chưa tồn tại

        const count = await sails.models[relModel].count({ [field]: normalizedCode });

        if (count > 0) {
          const error = new Error(
            `Cannot delete ${model}: still referenced in ${label || relModel} (${count} record${count > 1 ? 's' : ''})`
          );
          error.code = 'ERROR_RELATION_EXISTS';
          throw error;
        }
      }

      return true; // ✅ Không có ràng buộc
    } catch (err) {
      sails.log.error('Error in helper check-relation-exists:', err);
      throw err;
    }
  },
};
