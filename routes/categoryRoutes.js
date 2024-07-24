const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("viewTransactions.ejs", {
    title: "Manage Categories - BudgetBuddy",
  });
});

module.exports = router;
