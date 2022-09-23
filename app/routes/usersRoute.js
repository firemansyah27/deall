
module.exports = app => {
    const users = require("../controllers/usersController");
    const verifyToken = require("../middleware/verifyToken");
    const refreshToken = require("../middleware/refreshToken");
    const permission = require("../middleware/permission")
    var router = require("express").Router();
    
    // Authentication
    router.post("/auth/", users.authentication);
    router.post("/refresh-token/", refreshToken.refresh);

    // User
    router.get("/", verifyToken.verify, permission.isAdmin, users.findAll);
    router.post("/register/", verifyToken.verify, permission.isAdmin, users.register);
    router.get("/me/", verifyToken.verify, users.me);
    router.get("/:id/", verifyToken.verify, permission.isAdmin, users.findOne);
    router.put("/:id/", verifyToken.verify, permission.isAdmin, users.update);
    router.delete("/:id/", verifyToken.verify, permission.isAdmin, users.delete);
  
    app.use('/api/users', router);
};