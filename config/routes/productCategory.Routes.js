module.exports.routes = {
    'POST /product-category': 'product-category/create-product-category',
    'GET /product-category': 'product-category/list',
    'PATCH /product-category/:code': 'product-category/update-product-category',
    'DELETE /product-category/:code': 'product-category/delete',
}