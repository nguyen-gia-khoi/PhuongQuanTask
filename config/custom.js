/**
 * Custom configuration
 * (sails.config.custom)
 */
module.exports.custom = {

  // Catalog mã lỗi
  errorCatalog: {
    VALIDATION_ERROR: { status: 400, code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ.' },
    NOT_FOUND:        { status: 404, code: 'NOT_FOUND',        message: 'Không tìm thấy tài nguyên.' },
    UNAUTHORIZED:     { status: 401, code: 'UNAUTHORIZED',     message: 'Chưa xác thực.' },
    FORBIDDEN:        { status: 403, code: 'FORBIDDEN',        message: 'Không có quyền truy cập.' },
    CONFLICT:         { status: 409, code: 'CONFLICT',         message: 'Xung đột dữ liệu.' },
    SERVER_ERROR:     { status: 500, code: 'SERVER_ERROR',     message: 'Lỗi máy chủ.' }
  },

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: '2h',
};