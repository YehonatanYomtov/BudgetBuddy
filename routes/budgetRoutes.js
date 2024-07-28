const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController.js");

router.get("/user/:user_id", budgetController.getBudget);

module.exports = router;
