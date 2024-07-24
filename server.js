const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Cors setup
app.use(cors());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse request bodies (from PUT POST methods)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes setup
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.render("login.ejs", {
    title: "Login - BudgetBuddy",
  });
});

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
