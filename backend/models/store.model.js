module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define("store", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: Sequelize.STRING(400),
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    },
    ownerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    averageRating: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    }
  });

  return Store;
}; 