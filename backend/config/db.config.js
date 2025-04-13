require('dotenv').config();

const config = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_NAME,
  PORT: process.env.DB_PORT,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// For Sequelize CLI
module.exports = {
  development: {
    username: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    pool: config.pool
  },
  test: {
    username: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    pool: config.pool
  },
  production: {
    username: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    pool: config.pool
  }
};

// For Sequelize ORM
module.exports.config = config; 