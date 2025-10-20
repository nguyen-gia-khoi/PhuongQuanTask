const { fn } = require("./update-product-category");

module.exports = {
    friendlyName: 'Destroy product-category',  
    description: 'Xóa một liên kết giữa product và category dựa trên code của liên kết đó.',
    inputs: {
        code: {
            type: 'string',
            required: true,
            description: 'product-category needs to be deleted.'
        }
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
                model: 'productcategory',
                code: normalizedCode,
                shouldExist: true,
                normalize: false
            });
            const deletedProductCategory = await sails.models.productcategory.destroyOne({ 
                code: normalizedCode 
              });
            if (!deletedProductCategory) {
                const error = new Error('Failed to destroy category');
                error.code = 'ERROR99';
                throw error;
            }
            return { message: 'Category destroyed successfully' };
        } catch (err) {
            sails.log.error('Error in destroy-product-category:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to destroy product-category');
            error.code = 'ERROR99';
            throw error;
        }
    }
}