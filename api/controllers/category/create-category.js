module.exports = {
    friendlyName: 'Create category',
    description: 'Create a new category',
    inputs: {
        name: { type: 'string' },
        code: { type: 'string' },
        status: { type: 'string' },
        type: { type: 'string' },
        description: { type: 'string' },
        note: { type: 'string' },
    },
    fn: async function (inputs) {
        try {
            const result = await sails.helpers.category.createCategory.with({ data: inputs });
            return this.res.success(result);
        } catch (err) {
            sails.log.error('Error in create-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
              }
            return this.res.fail('ERROR99');
        }
    }
    
}
