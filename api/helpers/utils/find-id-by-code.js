module.exports = {
    friendlyName: 'Find id by code',
    description: 'Find record id by code for a given model',

    inputs: {
        model: { type: 'string', required: true },
        code: { type: 'string', required: true },
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

            const normalizedCode = String(inputs.code).trim().toUpperCase();
            const record = await Model.findOne({ code: normalizedCode,status: 0 });
            if (!record) {
                const error = new Error('Not found or code deleted');
                error.code = 'ERROR43';
                throw error;
            }

            return record.id;
        } catch (err) {
            if (err.code) throw err;
            const error = new Error(err.message || 'Internal server error');
            error.code = 'ERROR99';
            throw error;
        }
    }
};