module.exports = {
    friendlyName: 'Delete category',
    description: 'Delete a category',
    inputs: {
        code: { type: 'string', required: true },
    },
    fn: async function (inputs) {
        try {
            const result = await sails.helpers.category.destroyCategory.with({ code: inputs.code });
            return this.res.success(result);
        }catch(err){
            sails.log.error('Error in delete-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}