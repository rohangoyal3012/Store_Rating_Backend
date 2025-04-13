const express = require("express");
const cors = require("cors");
const db = require("./models");
require('dotenv').config();

const app = express();

// Configure CORS
var corsOptions = {
  origin: "http://localhost:3000" // Frontend URL
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to database
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((err) => {
    console.log("Failed to connect to database: " + err.message);
  });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Store Rating Application API." });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/store.routes')(app);
require('./routes/rating.routes')(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Function to initialize database with admin user
async function initial() {
  const bcrypt = require("bcrypt");
  const User = db.users;
  
  try {
    // Create admin user
    await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password: bcrypt.hashSync("Admin@123", 8),
      address: "Admin Office Address",
      role: "admin"
    });
    
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating initial data:", error);
  }
} 