module.exports = {
    friendlyName: 'Create product',
    description: 'Create a new product',
    // inputs: {
    //     name: { type: 'string' },
    //     code: { type: 'string' },
    //     status: { type: 'string' },
    //     type: { type: 'string' },
    //     description: { type: 'string' },
    //     note: { type: 'string' },
    //     amount: { type: 'string' },
    //     configuration: { type: 'json' },
    // },
    fn: async function () {
        try {
            const {name, code, status,type,description,note,amount,configuration } = this.req.body || {};
            const inputs = { name, code, status,type,description,note,amount,configuration };
            const result = await sails.helpers.product.createProduct.with({
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