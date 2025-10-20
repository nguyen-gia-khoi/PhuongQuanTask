module.exports = {
    friendlyName: 'Create product category',
    description: 'Create a link (productcategory) between a product and a category using productCode and categoryCode',

    inputs: {
        data: {
            type: 'ref',
            required: true,
            description: 'Object containing { name, code?, productCode, categoryCode, status?, type?, description?, note? }'
        }
    },

    fn: async function (inputs) {
        try {
            const { name, code, productCode, categoryCode } = inputs.data || {};
            let { status, type, description, note } = inputs.data || {};

            // Required fields
            if (!name || String(name).trim() === '' || !productCode || !categoryCode) {
                const error = new Error('Missing required field');
                error.code = 'ERROR40';
                throw error;
            }

            // Resolve productId, categoryId từ code
            const normalizedProductCode = String(productCode).trim().toUpperCase();
            const normalizedCategoryCode = String(categoryCode).trim().toUpperCase();

            const productId = await sails.helpers.utils.findIdByCode.with({
                model: 'product',
                code: normalizedProductCode
            });
            const categoryId = await sails.helpers.utils.findIdByCode.with({
                model: 'category',
                code: normalizedCategoryCode
            });

            // Tránh trùng quan hệ (product, category)
            const existed = await sails.models.productcategory.findOne({
                product: productId,
                category: categoryId
            });
            if (existed) {
                const error = new Error('Conflict: relation already exists');
                error.code = 'ERROR92';
                throw error;
            }

            // Generate id
            const id = await sails.helpers.utils.generateUuid();

            // Resolve code (client hoặc generate)
            let finalCode;
            if (code && String(code).trim() !== '') {
                finalCode = String(code).trim().toUpperCase();
                await sails.helpers.utils.checkCodeExists.with({
                    model: 'productcategory',
                    code: finalCode,
                    shouldExist: false,
                    normalize: false
                });
            } else {
                finalCode = await sails.helpers.utils.generateShortHash.with({ id });
                try {
                    await sails.helpers.utils.checkCodeExists.with({
                        model: 'productcategory',
                        code: finalCode,
                        shouldExist: false
                    });
                } catch (e) {
                    if (e.code !== 'ERROR92') throw e;
                    const fallback = id.replace(/-/g, '').slice(0, 10).toUpperCase();
                    await sails.helpers.utils.checkCodeExists.with({
                        model: 'productcategory',
                        code: fallback,
                        shouldExist: false
                    });
                    finalCode = fallback;
                }
            }

            // Optional validations
            const validStatus = [0, 1];
            const validType = [0, 1];

            const payload = {
                id,
                name: String(name).trim(),
                code: finalCode,
                product: productId,
                category: categoryId,
            };

            if (status !== undefined) {
                const s = Number(status);
                if (!validStatus.includes(s)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                payload.status = s;
            }

            if (type !== undefined) {
                const t = Number(type);
                if (!validType.includes(t)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                payload.type = t;
            }

            if (description !== undefined) payload.description = String(description).trim();
            if (note !== undefined) payload.note = String(note).trim();

            // Create productcategory record
            const created = await sails.models.productcategory.create(payload).fetch();

            return {
                message: 'Product category link created successfully',
                data: created
            };
        } catch (err) {
            sails.log.error('Error in create-product-category:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to create product-category');
            error.code = 'ERROR99';
            throw error;
        }
    }
};