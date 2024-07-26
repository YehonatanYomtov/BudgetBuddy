const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");

// router.get("/", (req, res) => {
//   res.render("manageCategories", {
//     title: "Manage Categories",
//     text: "Yay we did it!",
//   });
// });

router.get("/user/:user_id", categoryController.getCategoriesByUserId);
router.post("/", categoryController.createCategory);
router.post("/delete/:id", categoryController.deleteCategory);

module.exports = router;
