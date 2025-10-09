
// config/policies.js
module.exports.policies = {
  '*': true,
  'user/create-user': true,
  'user/list': true,
  'user/update-user': 'IsAuthenticated',
  'user/delete': 'IsAuthenticated', 
  'user/signin': true,
};