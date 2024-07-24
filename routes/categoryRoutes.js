const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("manageCategories", {
    title: "Manage Categories",
    text: "Yay we did it!",
  });
});

module.exports = router;
