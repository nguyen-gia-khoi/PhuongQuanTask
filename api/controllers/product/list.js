const { fn } = require("./create-product");

module.exports = {
    friendlyName : 'Create product',
    description : 'Create a new product',

     inputs: {
        name: { type: 'string' },
        code: { type: 'string' },
        status: { type: 'string' },
        type: { type: 'string' },
        description: { type: 'string' },
        note: { type: 'string' },
        amount: { type: 'string' },
        page: { type: 'number' },
        limit: { type: 'number' },

    },

    fn: async function (inputs) {
        try {
            const result = await sails.helpers.product.getProduct.with({
                data: inputs
            });
            return this.res.success({
                data: result,
                message: 'Product created successfully',
                status: 201
            });
        } catch (err) {
            sails.log.error('Error in create-product:', err);
            if (err.code) {
                return this.res.fail(err.code);
            }
            return this.res.fail('ERROR99');
        }
    }
}