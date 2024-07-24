const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Register - BudgetBuddy",
    heading2: "Dynamic Heading 2",
    heading3: "Dynamic Heading 3",
  });
});

module.exports = router;
