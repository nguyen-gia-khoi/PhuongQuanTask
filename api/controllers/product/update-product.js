const { fn } = require("./create-product");

module.exports = {
    friendlyName: 'Update product',
    description: 'Update product by ID',

    fn: async function () {
        try {
            const { code } = this.req.params || {};
            const{ name, status,type,description,note,amount,configuration } = this.req.body || {};
            const inputs = { name, code, status,type,description,note,amount,configuration };
            const result = await sails.helpers.product.updateProduct.with({
                data: inputs
            });
            return this.res.success({
                data: result,
                message: 'Product updated successfully',
                status: 200
            });
        } catch (err) {
            sails.log.error('Error in update-category:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }

}