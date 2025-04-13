const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
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
      message: "User registered successfully!",
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

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Current password is incorrect!" });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!req.body.newPassword || !passwordRegex.test(req.body.newPassword)) {
      return res.status(400).send({
        message: "New password must be 8-16 characters and include at least one uppercase letter and one special character."
      });
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();

    res.status(200).send({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 