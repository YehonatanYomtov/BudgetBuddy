const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

require("dotenv").config();

// Express setup
const app = express();

// Cors setup
app.use(cors());

// Static files setup
app.use("/", express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse request bodies (from PUT POST methods)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // Session expiration time (24 hours)
    },
  })
);

// Public routes (no authentication required)
const { register, login, logout } = require("./controllers/UserController.js");
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login", { error: "" }));
app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);

// Apply authentication middleware only to protected routes
const { checkUser } = require("./middlewares/authMiddleware.js");

// Protected routes
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const budgetRoutes = require("./routes/budgetRoutes.js");

// Protection for all proceeding routes
app.use(checkUser);

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/budget", budgetRoutes);

// Home page
app.get("/", (req, res) => res.render("index", { user: req.session.user }));

// API key for currency conversion
app.get("/api/get-api-key", (req, res) => {
  res.json({ apiKey: process.env.EXCHANGE_RATE_API_KEY });
});

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
