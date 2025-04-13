const controller = require("../controllers/rating.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { validateRating } = require("../middleware/validation.middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Routes for authenticated users
  app.post("/api/ratings", [verifyToken, validateRating], controller.submitRating);
  
  // Routes for all users
  app.get("/api/stores/:storeId/ratings", controller.getStoreRatings);
}; 