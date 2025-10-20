// module.exports = {
//     friendlyName: 'Get product category',
//     description: 'Get all productcategory by filters (name, code, status, type, productCode/categoryCode, product amount range)',

//     inputs: {
//         data: {
//             type: 'ref',
//             required: true,
//             description: 'Object: { name?, code?, status?, type?, categoryCode?, productCode?, minAmount?, maxAmount?, page?, limit?, sortBy?, sortDir? }'
//         }
//     },

//     fn: async function (inputs) {
//         try {
//             const {
//                 name,
//                 code,
//                 status,
//                 type,
//                 categoryCode,
//                 productCode,
//                 minAmount,
//                 maxAmount,
//                 page,
//                 limit,
//                 sortBy,
//                 sortDir
//             } = inputs.data || {};

//             // Build base criteria for ProductCategory
//             const criteria = {};

//             if (name !== undefined && String(name).trim() !== '') {
//                 criteria.name = String(name).trim();
//             }

//             if (code !== undefined && String(code).trim() !== '') {
//                 criteria.code = String(code).trim().toUpperCase();
//             }

//             if (status !== undefined) {
//                 const s = Number(status);
//                 const validStatus = [0, 1]; // theo model ProductCategory
//                 if (!validStatus.includes(s)) {
//                     const err = new Error('Invalid input format');
//                     err.code = 'ERROR41';
//                     throw err;
//                 }
//                 criteria.status = s;
//             }

//             if (type !== undefined) {
//                 const t = Number(type);
//                 const validType = [0, 1];
//                 if (!validType.includes(t)) {
//                     const err = new Error('Invalid input format');
//                     err.code = 'ERROR41';
//                     throw err;
//                 }
//                 criteria.type = t;
//             }

//             // Resolve categoryId by categoryCode (optional)
//             if (categoryCode !== undefined && String(categoryCode).trim() !== '') {
//                 const categoryId = await sails.helpers.utils.findIdByCode.with({
//                     model: 'category',
//                     code: String(categoryCode).trim().toUpperCase()
//                 });
//                 criteria.category = categoryId;
//             }

         
//             let productFilterIds = null;

//             // productCode -> productId
//             let productIdByCode = null;
//             if (productCode !== undefined && String(productCode).trim() !== '') {
//                 productIdByCode = await sails.helpers.utils.findIdByCode.with({
//                     model: 'product',
//                     code: String(productCode).trim().toUpperCase()
//                 });
//             }

//             // amount range -> product ids
//             const hasMin = minAmount !== undefined && minAmount !== null && String(minAmount).trim() !== '';
//             const hasMax = maxAmount !== undefined && maxAmount !== null && String(maxAmount).trim() !== '';
//             if (hasMin || hasMax) {
//                 const min = hasMin ? Number(minAmount) : undefined;
//                 const max = hasMax ? Number(maxAmount) : undefined;

//                 if ((hasMin && isNaN(min)) || (hasMax && isNaN(max))) {
//                     const err = new Error('Invalid input format');
//                     err.code = 'ERROR41';
//                     throw err;
//                 }
//                 if (hasMin && hasMax && min > max) {
//                     const err = new Error('Invalid input format');
//                     err.code = 'ERROR41';
//                     throw err;
//                 }

//                 const productWhere = {};
//                 if (hasMin && hasMax) {
//                     productWhere.amount = { '>=': min, '<=': max };
//                 } else if (hasMin) {
//                     productWhere.amount = { '>=': min };
//                 } else if (hasMax) {
//                     productWhere.amount = { '<=': max };
//                 }

//                 if (productIdByCode) {
//                     productWhere.id = productIdByCode;
//                 }

//                 const products = await sails.models.product.find({
//                     where: productWhere,
//                     select: ['id']
//                 });

//                 productFilterIds = products.map(p => p.id);
//                 if (productFilterIds.length === 0) {
//                     return {
//                         message: 'OK',
//                         data: {
//                             items: [],
//                             total: 0,
//                             page: Number(page) > 0 ? Number(page) : 1,
//                             limit: Number(limit) > 0 ? Number(limit) : 10
//                         }
//                     };
//                 }
//             } else if (productIdByCode) {
//                 productFilterIds = [productIdByCode];
//             }

//             if (productFilterIds) {
//                 criteria.product = productFilterIds.length === 1 ? productFilterIds[0] : { in: productFilterIds };
//             }

//             // Pagination + sorting
//             const pg = Number(page) > 0 ? Number(page) : 1;
//             const lm = Number(limit) > 0 ? Number(limit) : 10;
//             const skip = (pg - 1) * lm;

//             // Allow only known fields for sorting
//             const allowedSortBy = ['name', 'code', 'status', 'type', 'createdAt', 'updatedAt'];
//             const sb = allowedSortBy.includes(String(sortBy)) ? String(sortBy) : 'createdAt';
//             const sd = String(sortDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
//             const sort = `${sb} ${sd}`;

//             const [rawItems, total] = await Promise.all([
//             sails.models.productcategory.find({
//                 where: criteria,
//                 limit: lm,
//                 skip,
//                 sort,
//                 select: ['name','code','status','type','description','note','createdAt','updatedAt']
//             })
//             .populate('product')   
//             .populate('category'), 

//             sails.models.productcategory.count({ where: criteria })
//             ]);

            
//             // Loại bỏ product, category khỏi response (phòng trường hợp model có field khác)
//            const items = rawItems.map(({ product, category, ...rest }) => ({
//             ...rest,
//             productCode: product ? product.code : null,
//             categoryCode: category ? category.code : null
//             }));


            
//             return {
//                 message: 'OK',
//                 data: {
//                     items,
//                     total,
//                     page: pg,
//                     limit: lm
//                 }
//             };
//         } catch (err) {
//             sails.log.error('Error in get-product-category:', err);
//             if (err.code) {
//                 throw err;
//             }
//             const error = new Error(err.message || 'Failed to get product-category');
//             error.code = 'ERROR99';
//             throw error;    
//         }
//     }
// };






const _ = require('lodash');

module.exports = {
    friendlyName: 'Get product category',
    description: 'Get all productcategory by filters (name, code, status, type, productCode/categoryCode, product amount range)',

    inputs: {
        data: {
            type: 'ref',
            required: true,
            description: 'Object: { name?, code?, status?, type?, categoryCode?, productCode?, minAmount?, maxAmount?, page?, limit?, sortBy?, sortDir? }'
        }
    },

    fn: async function (inputs) {
        try {
            const {
                categoryCode,
                productCode,
                minAmount,
                maxAmount,
                page,
                limit,
                sortBy,
                sortDir
            } = inputs.data || {};

            // Base filter với lodash (giữ đơn giản cho name, code)
            // Lưu ý: status/type xử lý riêng để giữ được giá trị 0
            const baseFilter = _.pickBy(
                _.pick(inputs.data || {}, ['name', 'code']),
                _.identity // giống helper khác
            );

            // Chuẩn hoá code
            if (baseFilter.code) {
                baseFilter.code = String(baseFilter.code).trim().toUpperCase();
            }
            if (baseFilter.name) {
                baseFilter.name = String(baseFilter.name).trim();
            }

            // Khởi tạo criteria từ baseFilter
            const criteria = _.assign({}, baseFilter);

            // status/type: xử lý riêng để không làm rơi giá trị 0
            if (_.has(inputs.data, 'status')) {
                const s = Number(inputs.data.status);
                const validStatus = [0, 1];
                if (!validStatus.includes(s)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                criteria.status = s;
            }

            if (_.has(inputs.data, 'type')) {
                const t = Number(inputs.data.type);
                const validType = [0, 1];
                if (!validType.includes(t)) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                criteria.type = t;
            }

            // categoryCode -> categoryId
            if (categoryCode !== undefined && String(categoryCode).trim() !== '') {
                const categoryId = await sails.helpers.utils.findIdByCode.with({
                    model: 'category',
                    code: String(categoryCode).trim().toUpperCase()
                });
                criteria.category = categoryId;
            }

            // productCode/amount range -> product ids
            let productFilterIds = null;

            // productCode -> productId
            let productIdByCode = null;
            if (productCode !== undefined && String(productCode).trim() !== '') {
                productIdByCode = await sails.helpers.utils.findIdByCode.with({
                    model: 'product',
                    code: String(productCode).trim().toUpperCase()
                });
            }

            // amount range -> product ids
            const hasMin = _.has(inputs.data, 'minAmount') && String(minAmount).trim() !== '';
            const hasMax = _.has(inputs.data, 'maxAmount') && String(maxAmount).trim() !== '';
            if (hasMin || hasMax) {
                const min = hasMin ? Number(minAmount) : undefined;
                const max = hasMax ? Number(maxAmount) : undefined;

                if ((hasMin && isNaN(min)) || (hasMax && isNaN(max))) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }
                if (hasMin && hasMax && min > max) {
                    const err = new Error('Invalid input format');
                    err.code = 'ERROR41';
                    throw err;
                }

                const productWhere = {};
                if (hasMin && hasMax) {
                    productWhere.amount = { '>=': min, '<=': max };
                } else if (hasMin) {
                    productWhere.amount = { '>=': min };
                } else if (hasMax) {
                    productWhere.amount = { '<=': max };
                }

                if (productIdByCode) {
                    productWhere.id = productIdByCode;
                }

                const products = await sails.models.product.find({
                    where: productWhere,
                    select: ['id']
                });

                productFilterIds = products.map(p => p.id);
                if (productFilterIds.length === 0) {
                    const pg = Number(page) > 0 ? Number(page) : 1;
                    const lm = Number(limit) > 0 ? Number(limit) : 10;
                    return {
                        message: 'OK',
                        data: {
                            items: [],
                            total: 0,
                            page: pg,
                            limit: lm
                        }
                    };
                }
            } else if (productIdByCode) {
                productFilterIds = [productIdByCode];
            }

            if (productFilterIds) {
                criteria.product = productFilterIds.length === 1 ? productFilterIds[0] : { in: productFilterIds };
            }

            // Pagination + sorting
            const pg = Number(page) > 0 ? Number(page) : 1;
            const lm = Number(limit) > 0 ? Number(limit) : 10;
            const skip = (pg - 1) * lm;

            const allowedSortBy = ['name', 'code', 'status', 'type', 'createdAt', 'updatedAt'];
            const sb = allowedSortBy.includes(String(sortBy)) ? String(sortBy) : 'createdAt';
            const sd = String(sortDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            const sort = `${sb} ${sd}`;

            // Query + populate để trả kèm productCode/categoryCode (ẩn id)
            const [rawItems, total] = await Promise.all([
                sails.models.productcategory.find({
                    where: criteria,
                    limit: lm,
                    skip,
                    sort,
                    select: ['name','code','status','type','description','note','createdAt','updatedAt']
                })
                .populate('product')
                .populate('category'),
                sails.models.productcategory.count({ where: criteria })
            ]);

            const items = rawItems.map(({ product, category, ...rest }) => ({
                ...rest,
                productCode: product ? product.code : null,
                categoryCode: category ? category.code : null
            }));

            return {
                message: 'OK',
                data: {
                    items,
                    total,
                    page: pg,
                    limit: lm
                }
            };
        } catch (err) {
            sails.log.error('Error in get-product-category:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to get product-category');
            error.code = 'ERROR99';
            throw error;    
        }
    }
};