const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("viewTransactions.ejs", {
    title: "View Transactions - BudgetBuddy",
  });
});

module.exports = router;
