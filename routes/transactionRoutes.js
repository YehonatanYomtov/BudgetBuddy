const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController.js");

router.get("/", (req, res) => {
  res.render("viewTransactions.ejs", {
    title: "View Transactions - BudgetBuddy",
  });
});

router.get("/user/:user_id", transactionController.getTransactionsByUserId);
router.post("/", transactionController.createTransaction);
router.post("/delete/:id", transactionController.deleteTransaction);

module.exports = router;
