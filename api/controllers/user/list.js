
module.exports = {
  friendlyName: 'List users',
  description: 'Retrieve a list of all users with pagination and filters.',

  inputs: {
    page: {
      type: 'number',
      defaultsTo: 1,
      in: ['query'],
      description: 'Trang hiện tại',  
    },
    limit: {
      type: 'number',
      defaultsTo: 10,
      in: ['query'],
      description: 'Số lượng user trên mỗi trang',
    },
    name: {
      type: 'string',
      in: ['query'],
      description: 'Lọc theo tên',
    },
    age: {
      type: 'number',
      in: ['query'],
      description: 'Lọc theo tuổi',
    },
    email: {
      type: 'string',
      in: ['query'],
      description: 'Lọc theo email',
    },
    status: {
      type: 'string',
      in: ['query'],
      description: 'Lọc theo trạng thái',
    },
  },

  fn: async function (inputs) {
    try {
      const result = await sails.helpers.user.getUser.with({data: inputs});

      // Nếu helper trả về dữ liệu hợp lệ
      return this.res.success({
        total: result.total,
        page: result.page,
        limit: result.limit,
        data: result.data,
        message: 'User Listed successfully',
        status: 201
      });
    } catch (err) {
      sails.log.error('Error in list-users:', err);

      if (err.code) {
        return this.res.fail(err.code, err.message);
      }

      return this.res.fail('ERR500', err.message);
    }
  },
};
