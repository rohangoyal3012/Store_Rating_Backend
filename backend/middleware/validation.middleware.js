const validateSignUp = (req, res, next) => {
  // Validate name
  if (!req.body.name || req.body.name.length < 20 || req.body.name.length > 60) {
    return res.status(400).send({
      message: "Name must be between 20 and 60 characters."
    });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!req.body.email || !emailRegex.test(req.body.email)) {
    return res.status(400).send({
      message: "Please provide a valid email address."
    });
  }

  // Validate address
  if (!req.body.address || req.body.address.length > 400) {
    return res.status(400).send({
      message: "Address must not exceed 400 characters."
    });
  }

  // Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (!req.body.password || !passwordRegex.test(req.body.password)) {
    return res.status(400).send({
      message: "Password must be 8-16 characters and include at least one uppercase letter and one special character."
    });
  }

  next();
};

const validateRating = (req, res, next) => {
  const rating = parseInt(req.body.rating);
  
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).send({
      message: "Rating must be a number between 1 and 5."
    });
  }
  
  next();
};

const validationMiddleware = {
  validateSignUp,
  validateRating
};

module.exports = validationMiddleware; 