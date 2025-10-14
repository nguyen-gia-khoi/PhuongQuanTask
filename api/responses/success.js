// module.exports = function success(payload = {}, customMessage) {
//     const res = this.res;
  
//     // Cho phép gọi success(data) hoặc success({ data, status, message })
//     const status = payload.status || 200;
//     const message = customMessage || payload.message || 'OK';
//     const data = payload.data !== undefined ? payload.data : payload;
  
//     return res.status(status).json({
//       success: true,
//       message,
//       data,
//       timestamp: Date.now()
//     });
//   };



// api/responses/success.js
module.exports = function success(data) {
  const res = this.res;
  
  // Case 1: Có data
  if (data) {
    return res.status(200).json({
      success: true,
      message: 'OK',
      data: data,
      timestamp: Date.now()
    });
  }
  
  // Case 2: Default values
  return res.status(200).json({
    success: true,
    message: 'OK',
    timestamp: Date.now()
  });
};