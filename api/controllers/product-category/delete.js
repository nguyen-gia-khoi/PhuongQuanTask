

module.exports = {
    friendlyName: 'Destroy product-category',
    description: 'Delete a product-category record by code.',
    
    fn: async function () {
        try {
            const { code } = this.req.params || {};
            const result = await sails.helpers.productCategory.destroyProductCategory.with({
                code: code
            });
            return this.res.success({
                data: result,
                message: 'Product-Category deleted successfully',
                status: 200
            });
        }
        catch (err) {
            sails.log.error('Error in deleted-product-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}