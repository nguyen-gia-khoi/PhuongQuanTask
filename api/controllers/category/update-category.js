module.exports = {
    friendlyName: 'Update category',
    description: 'Update a category',
    inputs: {
        code: { type: 'string', required: true },
        name: { type: 'string' },
        status: { type: 'string' },
        type: { type: 'string' },
        description: { type: 'string' },
        note: { type: 'string' },
    },
    fn: async function (inputs) {
        try {
            const result = await sails.helpers.category.updateCategory.with({ data: inputs });
            return this.res.success(result);
        } catch (err) {
            sails.log.error('Error in update-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}