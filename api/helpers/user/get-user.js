
module.exports = {
    friendlyName: 'Get user',
    description: 'Get all users from the database.',

   
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 1,
      description: 'Trang hiện tại (mặc định là 1)',
    },
    limit: {
      type: 'number',
      defaultsTo: 10,
      description: 'Số lượng user mỗi trang (mặc định là 10)',
    },
  },

  exits: {
    success: {
      description: 'Danh sách user và tổng số user đã được trả về thành công.',
    },
  },

  fn: async function (inputs, exits) {
    try {
      // Tính toán skip và limit để phân trang
      const skip = (inputs.page - 1) * inputs.limit;

      // Lấy tổng số user trong database
      const totalUsers = await User.count();

      // Lấy danh sách user có phân trang & sắp xếp theo ngày tạo mới nhất
      const users = await User.find({
        sort: 'createdAt DESC',
        skip,
        limit: inputs.limit,
      });

      // Trả về kết quả
      return exits.success({
        total: totalUsers,
        page: inputs.page,
        limit: inputs.limit,
        data: users,
      });
    } catch (error) {
      return exits.error(error);
    }
  },
};