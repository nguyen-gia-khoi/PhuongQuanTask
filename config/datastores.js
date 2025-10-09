

module.exports.datastores = {




   myPostgresDb: {
    adapter: 'sails-postgresql',
    url: 'postgresql://postgres:03062004@localhost:5432/postgres',
    // Optional: Add other configuration options like pool size, SSL settings, etc.
    // ssl: true, // Example for enabling SSL
    // pool: {
    //   max: 10,
    //   min: 2,
    //   idleTimeoutMillis: 30000,
    // }
  },


};
