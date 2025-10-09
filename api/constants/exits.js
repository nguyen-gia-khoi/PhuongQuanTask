module.exports = {
    success: {
      description: 'Request succeeded',
      responseType: 'ok' // 200
    },
    validationError: {
      description: 'Input validation error',
      responseType: 'badRequest' // 400
    },
    conflict: {
      description: 'Conflict error',
      responseType: 'badRequest' // 409 không có sẵn, dùng badRequest tạm
    },
    serverError: {
      description: 'Server error',
      responseType: 'serverError' // 500
    },
    notFound: {
      description: 'Resource not found',
      responseType: 'notFound' // 404
    }

  };
  