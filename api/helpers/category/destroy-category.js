module.exports = {
    friendlyName: 'Destroy category',
    description: 'Destroy a category',
    inputs: {
        code: { type: 'string', required: true },
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
                model: 'category',
                code: normalizedCode,
                shouldExist: true,
                normalize: false
            });
            const deletedCategory = await sails.models.category.destroyOne({ 
                code: normalizedCode 
              });
            if (!deletedCategory) {
                const error = new Error('Failed to destroy category');
                error.code = 'ERROR99';
                throw error;
            }
            return { message: 'Category destroyed successfully' };
        } catch (error) {
            sails.log.error('Error in destroy-category:', error);
            if (error.code) {
                throw error;
            }
            error = new Error(error.message || 'Failed to destroy category');
            error.code = 'ERROR99';
            throw error;
        }
    }
}