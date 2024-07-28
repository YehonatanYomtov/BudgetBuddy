const { Budget } = require("../models/budgetModel.js");

const getBudget = async (req, res) => {
  const { user_id } = req.params;

  try {
    const expenses = (await Budget.getTotalExpenses(user_id)) || 0;
    const incomes = (await Budget.getTotalIncomes(user_id)) || 0;
    const balance = (incomes - expenses).toFixed(2);
    res.render("budgetSummary", {
      title: "Budget Summary",
      incomes,
      expenses,
      balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching budget summary." });
  }
};

module.exports = {
  getBudget,
};
