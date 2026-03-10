const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getUsers, getMe } = require("../controllers/userController");

router.get("/me", auth, getMe);
router.get("/", auth, getUsers);

module.exports = router;
