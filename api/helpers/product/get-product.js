const _ = require('lodash');


module.exports = {
    friendlyName: 'Get product',
    description: 'Get product by ID',
    inputs:{
      data: {
        type: 'ref',
        required: true,
        description: 'Object containing filter data (name, code, status, type, page, limit)'
        }
    },
    fn: async function (inputs) {
        try {
            const {
                name,
                code,
                status,
                type,
                page = 1,
                limit = 10,
              } = inputs.data || {};
              if (code) {
                    await sails.helpers.utils.checkCodeExists.with({
                    model: 'product',
                    code: code,
                    shouldExist: true,
                    normalize: true
                    });
                }
                const skip = (page - 1) * limit;

                const filter = _.pickBy(
                    _.pick(inputs.data, ['name', 'code', 'status', 'type']),
                    _.identity
                );
                const totalProducts = await sails.models.product.count({ where: filter });
                const products = await sails.models.product.find({
                    where: filter,
                    sort: 'createdAt DESC',
                    skip,
                    limit: limit,
                });

                if (!products || products.length === 0) {
                    const error = new Error('No products found');
                    error.code = 'ERROR01';
                    throw error;
                }

                // Loại bỏ id khỏi response (nếu muốn)
                const sanitized = products.map(({ id, ...rest }) => rest);

                return {
                    total: totalProducts,
                    page: page,
                    limit: limit,
                    data: sanitized,
                };
            } catch (err) {
            sails.log.error('Error in get-product:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(error.message || 'Failed to get product');
            error.code = 'ERROR99';
            throw error;
        }
    }
    
}