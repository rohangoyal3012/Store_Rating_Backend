const db = require("../models");
const Rating = db.ratings;
const Store = db.stores;
const { Op } = require("sequelize");

// Submit or update a rating
exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.userId;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: "Store not found." });
    }

    // Check if user has already rated this store
    const existingRating = await Rating.findOne({
      where: {
        userId,
        storeId
      }
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      
      // Update store's average rating
      await updateStoreAverageRating(storeId);
      
      return res.status(200).send({
        message: "Rating updated successfully!",
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        userId,
        storeId,
        rating
      });
      
      // Update store's average rating
      await updateStoreAverageRating(storeId);
      
      return res.status(201).send({
        message: "Rating submitted successfully!",
        rating: newRating
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get ratings for a specific store
exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: "Store not found." });
    }
    
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: db.users,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    res.status(200).send(ratings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Helper function to update store's average rating
async function updateStoreAverageRating(storeId) {
  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating']
    });
    
    if (ratings.length === 0) {
      await Store.update({ averageRating: 0 }, { where: { id: storeId } });
      return;
    }
    
    const sum = ratings.reduce((total, current) => total + current.rating, 0);
    const average = sum / ratings.length;
    
    await Store.update(
      { averageRating: parseFloat(average.toFixed(1)) },
      { where: { id: storeId } }
    );
  } catch (error) {
    console.error("Error updating store average rating:", error);
    throw error;
  }
} 