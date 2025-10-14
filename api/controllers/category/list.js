// api/controllers/category/list.js
module.exports = {
    friendlyName: 'List categories',
    description: 'Retrieve a list of all categories with pagination and filters.',
  
    inputs: {
      page: {
        type: 'number',
        defaultsTo: 1,
        description: 'Trang hiện tại',
      },
      limit: {
        type: 'number',
        defaultsTo: 10,
        description: 'Số lượng category trên mỗi trang',
      },
      name: {
        type: 'string',
        description: 'Lọc theo tên',
      },
      code: {
        type: 'string',
        description: 'Lọc theo mã code',
      },
      status: {
        type: 'number',
        description: 'Lọc theo trạng thái (0, 1, 2)',
      },
      type: {
        type: 'number',
        description: 'Lọc theo loại (0, 1)',
      },
    },
  
    fn: async function (inputs) {
      try {
        const result = await sails.helpers.category.getCategory.with({ data: inputs });
  
        return this.res.success(result);
      } catch (err) {
        sails.log.error('Error in list-categories:', err);
  
        if (err.code) {
          return this.res.fail(err.code);
        }
  
        return this.res.fail('ERROR99');
      }
    },
  };