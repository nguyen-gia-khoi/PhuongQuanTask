module.exports = {
    friendlyName: 'Update product category',
    description: 'Update a productcategory identified by code; prevent duplicate product-category pairs',

    inputs: {
        data: {
            type: 'ref',
            required: true,
            description: 'Object: { code, name?, status?, type?, description?, note?, productCode?, categoryCode? }'
        }
    },

    fn: async function (inputs) {
        try {
            const {
                code,
                name,
                productCode,
                categoryCode
            } = inputs.data || {};
            let { status, type, description, note } = inputs.data || {};
            console.log('inputs.data', inputs.data);
            // 1) Validate identifier
            if (!code || String(code).trim() === '') {
                const error = new Error('Missing required field');
                error.code = 'ERROR40';
                throw error;
            }
            const normalizedCode = String(code).trim().toUpperCase();

            // 2) Ensure record exists by code using utils
            await sails.helpers.utils.checkCodeExists.with({
                model: 'productcategory',
                code: normalizedCode,
                shouldExist: true
            });

            // 3) Load current record
            const current = await sails.models.productcategory.findOne({ code: normalizedCode });
            if (!current) {
                const error = new Error('Not found');
                error.code = 'ERROR91';
                throw error;
            }

            // 4) Build updates with validations
            const updates = {};

            if (name !== undefined) updates.name = String(name).trim();

            if (status !== undefined) {
                const s = Number(status);
                const validStatus = [0, 1];
                if (!validStatus.includes(s)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                updates.status = s;
            }

            if (type !== undefined) {
                const t = Number(type);
                const validType = [0, 1];
                if (!validType.includes(t)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                updates.type = t;
            }

            if (description !== undefined) updates.description = String(description).trim();
            if (note !== undefined) updates.note = String(note).trim();

            // 5) Resolve product/category by code via utils (optional)
            let newProductId = current.product;
            let newCategoryId = current.category;

            if (productCode !== undefined && String(productCode).trim() !== '') {
                newProductId = await sails.helpers.utils.findIdByCode.with({
                    model: 'product',
                    code: String(productCode).trim().toUpperCase()
                });
            }

            if (categoryCode !== undefined && String(categoryCode).trim() !== '') {
                newCategoryId = await sails.helpers.utils.findIdByCode.with({
                    model: 'category',
                    code: String(categoryCode).trim().toUpperCase()
                });
            }

            // 6) If pair changed, ensure not duplicate
            if (newProductId !== current.product || newCategoryId !== current.category) {
                const duplicate = await sails.models.productcategory.findOne({
                    product: newProductId,
                    category: newCategoryId,
                    id: { '!=': current.id }
                });
                if (duplicate) {
                    const err = new Error('Conflict: relation already exists');
                    err.code = 'ERROR92';
                    throw err;
                }
                updates.product = newProductId;
                updates.category = newCategoryId;
            }

            // 7) No change short-circuit
            if (Object.keys(updates).length === 0) {
                return {
                    message: 'No changes',
                    data: {
                        id: current.id,
                        code: current.code
                    }
                };
            }

            // 8) Do update
            const updated = await sails.models.productcategory.updateOne({ id: current.id }).set(updates);

            // 9) Sanitize response (remove product & category ids)
            const { product, category, ...sanitized } = updated || {};
            return {
                message: 'Product category updated successfully',
                data: sanitized
            };
        } catch (err) {
            sails.log.error('Error in update-product-category:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to update product-category');
            error.code = 'ERROR99';
            throw error;
        }
    }
};