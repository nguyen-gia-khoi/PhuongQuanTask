

module.exports = {
    friendlyName: 'Delete product',
    description: 'Delete a product by code',
    fn: async function () {
        try {
            const result = await sails.helpers.productCategory.createProductCategory.with({
                data: this.req.body
            });
            return this.res.success({
                data: result,
                message: 'Product category created successfully',
                status: 201
            });
        } catch (err) {
            sails.log.error('Error in create-product-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}