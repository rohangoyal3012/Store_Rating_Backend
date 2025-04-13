const db = require("../models");
const Store = db.stores;
const User = db.users;
const Rating = db.ratings;
const { Op } = require("sequelize");

// Create a new store (for admin)
exports.createStore = async (req, res) => {
  try {
    // Check if owner exists and is a store_owner
    const owner = await User.findByPk(req.body.ownerId);

    if (!owner) {
      return res.status(404).send({ message: "Owner not found." });
    }

    if (owner.role !== "store_owner") {
      return res.status(400).send({
        message: "The specified user must have a store_owner role.",
      });
    }

    // Create store
    const store = await Store.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      ownerId: req.body.ownerId,
    });

    res.status(201).send({
      message: "Store created successfully!",
      store,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all stores (for admin and normal users)
exports.getAllStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    let condition = {};

    if (name) condition.name = { [Op.iLike]: `%${name}%` };
    if (email) condition.email = { [Op.iLike]: `%${email}%` };
    if (address) condition.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // If user is logged in, include their rating for each store
    if (req.userId) {
      const userRatings = await Rating.findAll({
        where: { userId: req.userId },
        attributes: ["storeId", "rating"],
      });

      const ratingsMap = {};
      userRatings.forEach((rating) => {
        ratingsMap[rating.storeId] = rating.rating;
      });

      stores.forEach((store) => {
        store.dataValues.userRating = ratingsMap[store.id] || null;
      });
    }

    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!store) {
      return res.status(404).send({ message: "Store not found." });
    }

    // If user is logged in, include their rating
    if (req.userId) {
      const userRating = await Rating.findOne({
        where: {
          storeId: store.id,
          userId: req.userId,
        },
        attributes: ["rating"],
      });

      store.dataValues.userRating = userRating ? userRating.rating : null;
    }

    res.status(200).send(store);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get store details for store owner
exports.getStoreOwnerDashboard = async (req, res) => {
  try {
    // Get the store owned by the current user
    const store = await Store.findOne({
      where: { ownerId: req.userId },
      attributes: ["id", "name", "email", "address", "averageRating"],
    });

    if (!store) {
      return res
        .status(404)
        .send({ message: "Store not found for this owner." });
    }

    // Get users who rated this store
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).send({
      store,
      ratings,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
