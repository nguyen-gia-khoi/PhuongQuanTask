
module.exports.models = {
  migrate: 'alter',
  datastore: 'myPostgresDb',

  primaryKey: 'id',

  attributes: {
    
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },
  },

  dataEncryptionKeys: {
    default: 'igwPHltlLUCFEfJReMJsT5VQ0MYxJW4I33/T+eA0MDM='
  },
  cascadeOnDestroy: true
};
