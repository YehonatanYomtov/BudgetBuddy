const db = require("../config/db.js");

const Budget = {
  getTotalExpenses: (userId) =>
    db("transactions")
      .where({ user_id: userId, type: "expense" })
      .sum("amount")
      .first()
      .then((result) => result.sum),
  getTotalIncomes: (userId) =>
    db("transactions")
      .where({ user_id: userId, type: "income" })
      .sum("amount")
      .first()
      .then((result) => result.sum),
};

module.exports = { Budget };
