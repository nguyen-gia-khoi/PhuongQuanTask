// api/helpers/utils/check-code-exists.js
module.exports = {
    friendlyName: 'Check code exists',
    description: 'Check whether a code exists (or not) in a specified model',
  
    inputs: {
      model: { type: 'string', required: true, description: 'Model identity, e.g. category' },
      code: { type: 'string', required: true },
      shouldExist: {
        type: 'boolean',
        defaultsTo: false,
        description: 'true = code phải tồn tại, false = code không được tồn tại'
      },
      normalize: {
        type: 'boolean',
        defaultsTo: true,
        description: 'Trim + UPPERCASE code trước khi kiểm tra'
      }
    },
  
    fn: async function (inputs) {
      try {
        const identity = String(inputs.model).toLowerCase();
        const Model = sails.models[identity];
        if (!Model) {
          const error = new Error(`Invalid model: ${inputs.model}`);
          error.code = 'ERROR90'; // Bad request
          throw error;
        }
  
        let code = String(inputs.code);
        if (inputs.normalize) {
          code = code.trim().toUpperCase();
        }
  
        const record = await Model.findOne({ code });
  
        // shouldExist = true -> phải tìm thấy
        if (inputs.shouldExist && !record) {
          const error = new Error('Not found');
          error.code = 'ERROR91'; // Not found
          throw error;
        }
  
        // shouldExist = false -> KHÔNG được trùng
        if (!inputs.shouldExist && record) {
          const error = new Error('Conflict: code already exists');
          error.code = 'ERROR92'; // Conflict
          throw error;
        }
  
        return true;
      } catch (err) {
        if (err.code) throw err;
        const error = new Error(err.message || 'Internal server error');
        error.code = 'ERROR99';
        throw error;
      }
    }
  };