module.exports = {
    friendlyName: 'List product categories',
    description: 'Retrieve productcategory links with filters, pagination, and sorting.',
  
    inputs: {
      // filters on productcategory itself
      name: { type: 'string', description: 'Filter by name' },
      code: { type: 'string', description: 'Filter by code (normalized uppercase)' },
      status: { type: 'number', description: 'Filter by status (0, 1)' },
      type: { type: 'number', description: 'Filter by type (0, 1)' },
  
      // cross filters
      categoryCode: { type: 'string', description: 'Filter by category code' },
      productCode: { type: 'string', description: 'Filter by product code' },
      minAmount: { type: 'number', description: 'Filter by product amount >= minAmount' },
      maxAmount: { type: 'number', description: 'Filter by product amount <= maxAmount' },
  
      // pagination + sorting
      page: { type: 'number', defaultsTo: 1, description: 'Current page' },
      limit: { type: 'number', defaultsTo: 10, description: 'Items per page' },
      sortBy: { type: 'string', description: 'Sort field (name, code, status, type, createdAt, updatedAt)' },
      sortDir: { type: 'string', description: 'Sort direction (ASC | DESC)' }
    },
  
    fn: async function (inputs) {
      try {
        const result = await sails.helpers.productCategory.getProductCategory.with({
          data: inputs
        });
  
        return this.res.success({
          data: result,
          message: 'Product categories retrieved successfully',
          status: 200
        });
      } catch (err) {
        sails.log.error('Error in list-product-categories:', err);
        if (err.code) {
          return this.res.fail(err.code);
        }
        return this.res.fail('ERROR99');
      }
    }
  };