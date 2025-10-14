// api/constants/errorCodes.js
module.exports = {
  // ===== USER ERRORS (ERROR01-19) =====
  ERROR01: { status: 404, defaultMessage: 'User not found' },
  ERROR02: { status: 409, defaultMessage: 'Email already exists' },
  ERROR03: { status: 400, defaultMessage: 'Invalid email format' },
  ERROR04: { status: 400, defaultMessage: 'Password too short' },
  ERROR05: { status: 400, defaultMessage: 'Invalid user data' },
  
  // ===== AUTH ERRORS (ERROR20-39) =====
  ERROR20: { status: 401, defaultMessage: 'Invalid credentials' },
  ERROR21: { status: 401, defaultMessage: 'Token expired' },
  ERROR22: { status: 401, defaultMessage: 'Token invalid' },
  ERROR23: { status: 403, defaultMessage: 'Permission denied' },
  ERROR24: { status: 403, defaultMessage: 'Account locked' },
  
  // ===== VALIDATION ERRORS (ERROR40-59) =====
  ERROR40: { status: 400, defaultMessage: 'Missing required field' },
  ERROR41: { status: 400, defaultMessage: 'Invalid input format' },
  ERROR42: { status: 422, defaultMessage: 'Validation failed' },
  
  // ===== DATABASE ERRORS (ERROR60-79) =====
  ERROR60: { status: 500, defaultMessage: 'Database connection failed' },
  ERROR61: { status: 500, defaultMessage: 'Database query error' },
  
  // ===== GENERIC ERRORS (ERROR90-99) =====
  ERROR90: { status: 400, defaultMessage: 'Bad request' },
  ERROR91: { status: 404, defaultMessage: 'Not found' },
  ERROR92: { status: 409, defaultMessage: 'Conflict' },
  ERROR99: { status: 500, defaultMessage: 'Internal server error' },
};