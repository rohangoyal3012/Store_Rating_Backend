const { config: dbConfig } = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.stores = require("./store.model.js")(sequelize, Sequelize);
db.ratings = require("./rating.model.js")(sequelize, Sequelize);

// Define relationships
db.stores.belongsTo(db.users, {
  foreignKey: 'ownerId',
  as: 'owner'
});

db.users.hasMany(db.stores, {
  foreignKey: 'ownerId',
  as: 'ownedStores'
});

db.ratings.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
});

db.ratings.belongsTo(db.stores, {
  foreignKey: 'storeId',
  as: 'store'
});

db.users.hasMany(db.ratings, {
  foreignKey: 'userId',
  as: 'ratings'
});

db.stores.hasMany(db.ratings, {
  foreignKey: 'storeId',
  as: 'ratings'
});

module.exports = db; 