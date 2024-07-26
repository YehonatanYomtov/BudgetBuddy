const router = require("express").Router();

const {
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
  getProfileInfo,
} = require("../controllers/userController.js");

router.get("/", getAllUsers);
router.get("/:id", getAUser);
router.get("/profile/:id", getProfileInfo);

router.put("/:id", updateAUser);

router.delete("/:id", deleteAUser);

module.exports = router;
