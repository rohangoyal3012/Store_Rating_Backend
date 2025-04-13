const controller = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { validateSignUp } = require("../middleware/validation.middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Routes for admin
  app.get("/api/users", [verifyToken, isAdmin], controller.getAllUsers);
  app.get("/api/users/:id", [verifyToken, isAdmin], controller.getUserById);
  app.post("/api/users", [verifyToken, isAdmin, validateSignUp], controller.createUser);
  app.get("/api/dashboard/stats", [verifyToken, isAdmin], controller.getDashboardStats);
  
  // Routes for all authenticated users
  app.get("/api/user/profile", verifyToken, controller.getCurrentUser);
}; 