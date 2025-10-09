const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {
  try {
    const auth = req.headers.authorization || '';
    const [scheme, token] = auth.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'missing_or_invalid_authorization_header'
      });
    }

    const decoded = jwt.verify(token, sails.config.custom.jwtSecret);

    const user = await User.findOne({ id: decoded.sub });
    if (!user || user.status !== 'active') {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'inactive_or_missing_user'
      });
    }

    req.me = decoded;
    req.user = user;
    return proceed();
  } catch (e) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'invalid_or_expired_token'
    });
  }
};