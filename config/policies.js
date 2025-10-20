const isAdmin = require("../api/policies/isAdmin");

// config/policies.js
module.exports.policies = {
  '*': true,
  'user/create-user': true,
  'user/list': 'IsAuthenticated',
  'user/update-user': 'IsAuthenticated',
  'user/delete': 'IsAuthenticated', 
  'user/signin': true,
  'product/list': 'isAdmin',
};