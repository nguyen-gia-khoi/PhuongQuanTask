// api/helpers/utils/check-id-exists.js
module.exports = {
    friendlyName: 'Check ID exists',
    description: 'Check whether an ID exists (or not) in a specified model',
  
    inputs: {
      model: { 
        type: 'string', 
        required: true, 
        description: 'Model identity, e.g. product, category' 
      },
      id: { 
        type: 'string', 
        required: true,
        description: 'ID to check (UUID)' 
      },
      shouldExist: {
        type: 'boolean',
        defaultsTo: false,  // ← SỬA: đổi từ true thành false để đồng nhất với check-code-exists
        description: 'true = id phải tồn tại, false = id không được tồn tại'
      }
    },
  
    fn: async function (inputs) {
      try {
        const identity = String(inputs.model).toLowerCase();
        const Model = sails.models[identity];
        
        if (!Model) {
          const error = new Error(`Invalid model: ${inputs.model}`);
          error.code = 'ERROR90';
          throw error;
        }
  
        const record = await Model.findOne({ id: inputs.id });
  
        // shouldExist = true -> phải tìm thấy
        if (inputs.shouldExist && !record) {
          const error = new Error('Not found');  // ← SỬA: message ngắn gọn hơn
          error.code = 'ERROR91';  // ← SỬA: dùng ERROR91 như check-code-exists
          throw error;
        }
  
        // shouldExist = false -> KHÔNG được tồn tại
        if (!inputs.shouldExist && record) {
          const error = new Error('Conflict: ID already exists');  // ← SỬA: message rõ ràng hơn
          error.code = 'ERROR92';
          throw error;
        }
  
        return record || true;  // ← GIỮ NGUYÊN: trả về record để dùng data
      } catch (err) {
        if (err.code) throw err;
        const error = new Error(err.message || 'Internal server error');
        error.code = 'ERROR99';
        throw error;
      }
    }
  };