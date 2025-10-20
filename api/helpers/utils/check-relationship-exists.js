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
      const normalizedModel = String(model).toLowerCase();
      const normalizedCode = String(code).trim().toUpperCase();

      // ✅ Kiểm tra model tồn tại
      const MainModel = sails.models[normalizedModel];
      if (!MainModel) {
        const error = new Error(`Model "${normalizedModel}" does not exist`);
        error.code = 'ERROR91';
        throw error;
      }

      // ✅ Kiểm tra bản ghi tồn tại
      const recordId = await sails.helpers.utils.findIdByCode.with({
        model: normalizedModel,
        code: normalizedCode,
      });

      if (!recordId) {
        const error = new Error(`${normalizedModel} not found`);
        error.code = 'ERROR91';
        throw error;
      }

      // ✅ Kiểm tra các quan hệ
      for (const relation of relations) {
        const { model: relModel, field, label } = relation;

        if (!sails.models[relModel]) continue; // Bỏ qua nếu model liên quan không tồn tại

        const count = await sails.models[relModel].count({ [field]: recordId });

        if (count > 0) {
          const error = new Error('Record has related data');
          error.code = 'ERROR44';
          throw error;
        }
      }

      // ✅ Không có ràng buộc nào
      return true;
    } catch (err) {
      sails.log.error('Error in helper check-relation-exists:', err);
      throw err;
    }
  },
};
