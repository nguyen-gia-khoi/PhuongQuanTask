module.exports['swagger-generator'] = {
  disabled: false,
  swaggerJsonPath: './swagger/swagger.json',
  swagger: {
    openapi: '3.0.0',
    info: {
      title: 'ApiDemo Swagger',
      description: 'RESTful API documentation for ApiDemo project',
      contact: { name: 'Your Name', email: 'you@example.com' },
      license: { name: 'MIT' },
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:1337/' }],
    externalDocs: { url: 'https://example.com/docs' },
    components: {
      securitySchemes: {
        bearerAuthorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token with `Bearer <token>`'
        }
      },
     
    },
    security: [{ bearerAuthorization: [] }]
  },
  
  defaults: {
    responses: {
      '200': { description: 'Success' },
      '400': { description: 'Bad request' },
      '401': { description: 'Unauthorized' },
      '403': { description: 'Forbidden' },
      '404': { description: 'Resource not found' },
      '409': { description: 'Conflict' },
      '500': { description: 'Internal server error' }
    }
  },
  parse: {
    jsdoc: true,
    route: true
  },

  components: {
  schemas: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        description: { type: 'string', example: 'Software developer' },
        age: { type: 'number', example: 25 },
      },
    },
  },
},

  excludeDeprecatedPutBlueprintRoutes: true,
  includeRoute: function (routeInfo) {
    if (routeInfo.verb === 'put' && routeInfo.path.includes('/user/:id')) {
      return false;
    }
    return true;
  },
 
  updateBlueprintActionTemplates: function (blueprintActionTemplates) {
    blueprintActionTemplates.update = {
      summary: 'Update {globalId}',
      description: 'Update an existing {globalId} record',
      security: [{ bearerAuthorization: [] }],
      responses: {
        '200': { description: 'User updated successfully' }
      }
    };
    blueprintActionTemplates.destroy = {
      summary: 'Delete {globalId}',
      description: 'Delete an existing {globalId} record',
      security: [{ bearerAuthorization: [] }],
      responses: {
        '200': { description: 'User deleted successfully' },
        '404': { description: 'User not found' }
      }
    };
    return blueprintActionTemplates;
  },
  postProcess: function (specifications) {
    const paths = specifications.paths;
    if (paths['/user/{email}']) {
      paths['/user/{email}'].put = { ...paths['/user/{email}'].put };
      paths['/user/{email}'].delete = { ...paths['/user/{email}'].delete };
    }

    
  },
  
  
};
