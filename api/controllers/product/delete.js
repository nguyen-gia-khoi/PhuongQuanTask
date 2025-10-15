module.exports = {
    friendlyName: 'Delete product',
    description: 'Delete a product by code',
    inputs: {
        code: { type: 'string', required: true, description: 'The code of the product to delete' }
    },
    fn: async function (inputs) {
        try {
            const result = await sails.helpers.product.destroyProduct.with({
                code: inputs.code
            });
            return this.res.success({
                data: result,
                message: 'Product deleted successfully',
                status: 200
            });
        } catch (err) {
            sails.log.error('Error in delete-product:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}
