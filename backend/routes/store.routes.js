const controller = require("../controllers/store.controller");
const { verifyToken, isAdmin, isStoreOwner } = require("../middleware/auth.middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Routes for admin
  app.post("/api/stores", [verifyToken, isAdmin], controller.createStore);
  
  // Routes for all users (including non-authenticated)
  app.get("/api/stores", controller.getAllStores);
  app.get("/api/stores/:id", controller.getStoreById);
  
  // Routes for store owners
  app.get("/api/store-owner/dashboard", [verifyToken, isStoreOwner], controller.getStoreOwnerDashboard);
}; 