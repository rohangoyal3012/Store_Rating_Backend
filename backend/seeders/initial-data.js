const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;
const Store = db.stores;
const Rating = db.ratings;

async function seedDatabase() {
  try {
    // Create admin user
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password: bcrypt.hashSync("Admin@123", 8),
      address: "Admin Office Address, Building 123, Street 456, City",
      role: "admin",
    });

    console.log("Admin user created successfully");

    // Create store owners
    const storeOwner1 = await User.create({
      name: "John Smith Store Owner",
      email: "john@example.com",
      password: bcrypt.hashSync("Owner@123", 8),
      address: "123 Main Street, Apartment 4B, New York, NY 10001",
      role: "store_owner",
    });

    const storeOwner2 = await User.create({
      name: "Sarah Johnson Store Owner",
      email: "sarah@example.com",
      password: bcrypt.hashSync("Owner@123", 8),
      address: "456 Park Avenue, Suite 789, Los Angeles, CA 90001",
      role: "store_owner",
    });

    console.log("Store owners created successfully");

    // Create normal users
    const normalUser1 = await User.create({
      name: "Michael Brown Regular User",
      email: "michael@example.com",
      password: bcrypt.hashSync("User@123", 8),
      address: "789 Broadway, Apartment 5C, Chicago, IL 60007",
      role: "user",
    });

    const normalUser2 = await User.create({
      name: "Jessica Williams Regular User",
      email: "jessica@example.com",
      password: bcrypt.hashSync("User@123", 8),
      address: "321 Oak Street, Houston, TX 77001",
      role: "user",
    });

    console.log("Normal users created successfully");

    // Create stores
    const store1 = await Store.create({
      name: "John's Electronics",
      email: "store1@example.com",
      address: "100 Tech Plaza, San Francisco, CA 94105",
      ownerId: storeOwner1.id,
    });

    const store2 = await Store.create({
      name: "Sarah's Fashion Boutique",
      email: "store2@example.com",
      address: "200 Fashion Avenue, New York, NY 10018",
      ownerId: storeOwner2.id,
    });

    console.log("Stores created successfully");

    // Create ratings
    await Rating.create({
      userId: normalUser1.id,
      storeId: store1.id,
      rating: 4,
    });

    await Rating.create({
      userId: normalUser2.id,
      storeId: store1.id,
      rating: 5,
    });

    await Rating.create({
      userId: normalUser1.id,
      storeId: store2.id,
      rating: 3,
    });

    console.log("Ratings created successfully");

    // Update store average ratings
    await updateStoreAverageRating(store1.id);
    await updateStoreAverageRating(store2.id);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Helper function to update store's average rating
async function updateStoreAverageRating(storeId) {
  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ["rating"],
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

// Run the seeder
seedDatabase();
