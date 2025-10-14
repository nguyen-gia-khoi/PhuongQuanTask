// api/helpers/utils/check-name-exists.js
module.exports = {
    friendlyName: 'Check name exists',
    description: 'Check whether a name exists (or not) in a specified model',
  
    inputs: {
      model: { type: 'string', required: true, description: 'Model identity, e.g. category' },
      name: { type: 'string', required: true },
      shouldExist: {
        type: 'boolean',
        defaultsTo: false,
        description: 'true = name phải tồn tại, false = name không được tồn tại'
      },
      normalize: {
        type: 'boolean',
        defaultsTo: true,
        description: 'Trim name trước khi kiểm tra'
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
  
        let name = String(inputs.name);
        if (inputs.normalize) {
          name = name.trim(); 
        }
  
        const record = await Model.findOne({ name });
  
        if (inputs.shouldExist && !record) {
          const error = new Error('Not found');
          error.code = 'ERROR91';
          throw error;
        }

        if (!inputs.shouldExist && record) {
          const error = new Error('Conflict: name already exists');
          error.code = 'ERROR92';
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