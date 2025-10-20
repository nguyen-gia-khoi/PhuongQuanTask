
module.exports = {
    tableName:'product',
    attributes: {
        id: { type: 'string', columnType: 'char(36)', required: true, unique: true },
        name: { type: 'string', required: true },
        code: { type: 'string', allowNull: true,unique: true },
        status: { type: 'number', defaultsTo: 0, description: '0: active, 1: inactive' },
        type: { type: 'number', defaultsTo: 0, description: '0: normal' },
        description: { type: 'string', allowNull: true },
        note: { type: 'string', allowNull: true },
        amount: { type: 'number', allowNull: true },
        configuration: { type: 'json' },
    
        // Quan hệ 1-nhiều với ProductCategory
        categories: {
          collection: 'category',
          through: 'productcategory',
          via: 'product'
        }
    },
}