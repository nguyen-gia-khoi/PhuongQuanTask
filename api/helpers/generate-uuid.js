module.exports = {

    friendlyName: 'Generate UUID',
  
    description: 'Return a v4 UUID string.',
  
    exits: { success: { description: 'OK' } },
  
    fn: async function () {
      return require('crypto').randomUUID();
    }
  };