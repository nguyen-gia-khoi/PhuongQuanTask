
// const errorCodes = require('../constants/errorCodes');

// module.exports = function fail(codeOrPayload, customMessage) {
//   const req = this.req;
//   const res = this.res;
//   let payload = {};
  
//   // Case 1: fail('ERROR02') hoặc fail('ERROR02', 'Custom message')
//   if (typeof codeOrPayload === 'string') {
//     const errorCode = codeOrPayload;
//     const errorInfo = errorCodes[errorCode];
    
//     if (errorInfo) {
//       payload.code = errorCode;
//       payload.status = errorInfo.status;
//       payload.message = customMessage || errorInfo.defaultMessage;
//     } else {
//       payload.code = errorCode;
//       payload.message = customMessage || 'An error occurred';
//       payload.status = 400;
//     }
//   } 
//   // Case 2: fail({ code: 'ERROR02', message: '...', status: 409 })
//   else {
//     payload = codeOrPayload || {};
    
//     if (payload.code && errorCodes[payload.code]) {
//       const errorInfo = errorCodes[payload.code];
//       payload.status = payload.status || errorInfo.status;
//       payload.message = payload.message || errorInfo.defaultMessage;
//     }
//   }
  
//   // Default values nếu vẫn chưa có
//   const status = payload.status || 400;
//   const code = payload.code || 'ERROR90';  // Bad Request
//   const message = payload.message || 'Request failed';
//   const errors = payload.errors || payload.details;
//   const data = payload.data;

//   return res.status(status).json({
//     success: false,
//     code,
//     message,
//     errors,
//     data,
//     path: req.path,
//     timestamp: Date.now() 
//   });
// };



// api/responses/fail.js
const errorCodes = require('../constants/errorCodes');

module.exports = function fail(code) {
  const req = this.req;
  const res = this.res;
  
  // Case 1: Có error code trong errorCodes.js
  if (code && errorCodes[code]) {
    const errorInfo = errorCodes[code];
    return res.status(errorInfo.status).json({
      success: false,
      code: code,
      message: errorInfo.defaultMessage,
      path: req.path,
      timestamp: Date.now()
    });
  }
  
  // Case 2: Default values
  return res.status(400).json({
    success: false,
    code: 'ERROR90',  // Bad Request code
    message: 'Request failed',
    path: req.path,
    timestamp: Date.now()
  });
};