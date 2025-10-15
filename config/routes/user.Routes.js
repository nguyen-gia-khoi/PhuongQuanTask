// module.exports = {
// 'POST /user': 'user/create-user',
// 'GET /user': 'user/list-users',
// 'DELETE /user/:email': 'user/delete-user',
// 'PUT /user/:email': 'user/update-user',
// 'POST /auth/signin': 'user/signin',

// }

// module.exports.routes = {
//   'POST /user':        { action: 'user/create-user' },
//   'DELETE /user/:email': { action: 'user/delete-user' },
//   'GET /user':         { action: 'user/list-users' },
//   'POST /auth/signin': { action: 'user/signin' },
//   'PUT /user/:id':     { action: 'user/update-user' },
// };

module.exports = {
  'GET /user': 'user/list',
  'POST /user': 'user/create-user', 
  'DELETE /user/:email': 'user/delete',
  'PATCH /user/:email': 'user/update-user',
  'POST /auth/signin': 'user/signin',
};