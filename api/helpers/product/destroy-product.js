const { cloneDeep } = require("lodash");

module.exports = {
    friendlyName: 'Delete product',
    description: 'Delete a product by code',
    inputs: {
        code: { type: 'string', required: true, description: 'The code of the product to delete' }
    },
    fn: async function (inputs) {
        try {
            const { code } = inputs || {};
            if (!code || String(code).trim() === '') {
                const error = new Error('Missing required field: code');
                error.code = 'ERROR40';
                throw error;
            }
            const normalizedCode = String(code).trim().toUpperCase();

            await sails.helpers.utils.checkCodeExists.with({
                model: 'product',
                code: normalizedCode,
                shouldExist: true,
                normalize: false
            });
            const deleteProduct = await sails.models.product.destroyOne({ 
                code: normalizedCode 
              });
            if (!deleteProduct) {
                const error = new Error('Failed to destroy category');
                error.code = 'ERROR99';
                throw error;
            }

            return { message: 'Product destroyed successfully' };

        } catch (err) {
            sails.log.error('Error in destroy-category:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to destroy product');
            error.code = 'ERROR99';
            throw error;
        }
    }
}