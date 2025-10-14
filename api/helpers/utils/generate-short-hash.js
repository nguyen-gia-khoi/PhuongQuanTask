// api/helpers/utils/generate-short-hash.js
module.exports = {
    friendlyName: 'Generate short hash',
    description: 'Generate a short hash using shorthash2',
    inputs: {
        id: { type: 'string', required: true },
    },
    fn: async function (inputs) {
        try {
            const shorthash = require('shorthash2');
            const hash = shorthash(inputs.id); // returns short hash string
            return hash.toUpperCase(); // optional: normalize
        } catch (err) {
            const error = new Error(err.message || 'Failed to generate short hash');
            error.code = 'ERROR99';
            throw error;
        }
    }
};