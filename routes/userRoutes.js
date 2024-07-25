const router = require("express").Router();

const {
  register,
  login,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
} = require("../controllers/userController.js");

// router.post("/register", register);
// router.post("/login", login);

router.get("/", getAllUsers);

router.get("/:id", getAUser);

router.put("/:id", updateAUser);

router.delete("/:id", deleteAUser);

module.exports = router;
