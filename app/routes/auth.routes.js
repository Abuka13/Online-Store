console.log("✅ AUTH ROUTES LOADED");



const router = require("express").Router();
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validators");
const auth = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), auth.register);
router.post("/login", validate(loginSchema), auth.login);

module.exports = router;
