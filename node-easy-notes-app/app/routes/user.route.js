const express = require("express");
const router = express.Router();    

const users_controller = require("../controllers/user.controller");



router.post("/register", users_controller.createUser);
router.post("/userLogin", users_controller.userLogin);
router.post("/getAll", users_controller.getAll);
router.post("/getUserByEmail", users_controller.getUserByEmail);
router.put("/user/:id", users_controller.updateUser);
router.delete("/user", users_controller.deleteUser);
router.post("/resetpassword", users_controller.resetpassword);

router.post("/varifyemail", users_controller.varifyemail);

module.exports = router;