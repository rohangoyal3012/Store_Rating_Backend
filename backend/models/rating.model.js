module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define("rating", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    storeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "stores",
        key: "id",
      },
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  });

  return Rating;
};
