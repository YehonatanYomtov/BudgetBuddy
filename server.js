const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

// Cors setup
app.use(cors());

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
    saveUninitialized: true,
  })
);

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes setup
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

// Root route with authentication check
const { checkUser } = require("./middlewares/authMiddleware.js");
const { register, login } = require("./controllers/UserController.js");

app.get("/", checkUser, (req, res) => {
  res.render("index", {
    user: req.session.user,
  });
});

app.post("/register", register);
app.get("/register", (req, res) => res.render("register"));
app.post("/login", login);
app.get("/login", (req, res) => res.render("login"));

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
