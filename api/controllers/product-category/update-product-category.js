module.exports = {
    friendlyName: 'Update product category',
    description: 'Update a product category by code',
    
    fn: async function () {
        try {
            const { code } = this.req.params || {};
            const { name, status, type, description, note, productCode, categoryCode } = this.req.body || {};

            const inputs = { code, name, status, type, description, note, productCode, categoryCode };

            const result = await sails.helpers.productCategory.updateProductCategory.with({ data: inputs });

            return this.res.success({
                data: result,
                message: 'Product category updated successfully',
                status: 200
            });
        } catch (err) {
            sails.log.error('Error in update-product-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
};