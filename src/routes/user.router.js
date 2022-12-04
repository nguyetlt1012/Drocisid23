const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("users/login",  authController.login);
router.post("users/signup",  authController.signup);

module.exports = router;
