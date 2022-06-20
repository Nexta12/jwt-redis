const router = require("express").Router();
const auth_middleware = require("../middlewares/auth.middleware");


router.get("/dashboard", auth_middleware.verifyToken, (req, res) => {
  return res.json({ status: true, message: "Welcome to Dashboard" });
});

module.exports = router;
