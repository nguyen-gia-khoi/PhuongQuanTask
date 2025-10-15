const _ = require('lodash');

module.exports= {
    friendlyName: 'update product',
    description: 'Update product',
    inputs: {
        data: {
            type: 'ref',
            required: true,
            description: 'Data for updating the product',
        }

    },
    fn: async function (inputs) {
        try {
            const { code } = inputs.data || {};
        if (!code || String(code).trim() === '') {
            const error = new Error('Missing required field: code');
            error.code = 'ERROR40';
            throw error;
        }
        const normalizedCode = String(code).trim().toUpperCase();

        // Đảm bảo product với code này tồn tại
        await sails.helpers.utils.checkCodeExists.with({
            model: 'product',
            code: normalizedCode,
            shouldExist: true,
            normalize: false
        });
        const allowedKeys = ['name', 'status', 'type', 'description','amount', 'note', 'configuration'];
        const toUpdate = _.pickBy(_.pick(inputs.data, allowedKeys), _.identity);
        
        if (_.isEmpty(toUpdate)) {
        const error = new Error('No valid fields to update');
        error.code = 'ERROR40';
        throw error;
        }

        const validStatus = [0, 1, 2];
        const validType = [0, 1];

        if (toUpdate.status !== undefined) {
        const s = Number(toUpdate.status);
        if (!validStatus.includes(s)) {
            const error = new Error('Invalid input format');
            error.code = 'ERROR41';
            throw error;
            }
            toUpdate.status = s;
        }

        if (toUpdate.type !== undefined) {
            const t = Number(toUpdate.type);
            if (!validType.includes(t)) {
            const error = new Error('Invalid input format');
            error.code = 'ERROR41';
            throw error;
            }
            toUpdate.type = t;
        }
        if (toUpdate.configuration) {
            if (_.isString(toUpdate.configuration)) {
                toUpdate.configuration = JSON.parse(toUpdate.configuration);
            }
            const existing = await sails.models.product.findOne({ code: normalizedCode });
            toUpdate.configuration = _.merge({}, existing.configuration, toUpdate.configuration);
        }


        const updateProduct = await sails.models.product.updateOne({ code: normalizedCode }).set(toUpdate);
        if (!updateProduct) {
            const error = new Error('Failed to update product');    
            error.code = 'ERROR99';
            throw error;
        }
        const { id, ...sanitized } = updateProduct;

        return {
            message: 'Product updated successfully',
            data: sanitized
        }
      
        } catch (err) {
            sails.log.error('Error in update-category helper:', err);
            if (err.code) throw err;

            const error = new Error(err.message || 'Failed to update category');
            error.code = 'ERROR99';
            throw error;
        }
    }
}