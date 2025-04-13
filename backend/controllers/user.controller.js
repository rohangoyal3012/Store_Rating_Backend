const db = require("../models");
const User = db.users;
const Store = db.stores;
const Rating = db.ratings;
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let condition = {};
    
    if (name) condition.name = { [Op.iLike]: `%${name}%` };
    if (email) condition.email = { [Op.iLike]: `%${email}%` };
    if (address) condition.address = { [Op.iLike]: `%${address}%` };
    if (role) condition.role = role;

    const users = await User.findAll({
      where: condition,
      attributes: { exclude: ['password'] }
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get user details by ID (for admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'ownedStores',
          attributes: ['id', 'name', 'averageRating'],
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new user (for admin)
exports.createUser = async (req, res) => {
  try {
    // Create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      address: req.body.address,
      role: req.body.role || "user"
    });

    res.status(201).send({
      message: "User created successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get dashboard statistics (for admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.status(200).send({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 