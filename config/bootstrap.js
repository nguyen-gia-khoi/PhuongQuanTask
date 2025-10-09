/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  const { Client } = require('pg');

  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '03062004', // thay bằng mật khẩu thật của bạn
    database: 'postgres'
  });

  try {
    await client.connect();
    sails.log.info('✅ Connected to PostgreSQL successfully!');
    await client.end();
  } catch (err) {
    sails.log.error('❌ Failed to connect to PostgreSQL:', err.message);
    return process.exit(1); // Dừng server nếu lỗi
  }



};
