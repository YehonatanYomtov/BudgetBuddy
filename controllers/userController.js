const bcrypt = require("bcrypt");

const {
  _register,
  _findUserByUsername,
  _findUserByEmail,
  _getAllUsers,
  _getAUser,
  _updateAUser,
  _deleteAUser,
} = require("../models/userModel.js");

//! Add confirm password (to lower case etc.)
//! Create an array for errors and then display them
//! reject password that is shorter then 6 characters

async function register(req, res) {
  const { username, email, password } = req.body;

  console.log(username);
  if (!username || !email || !password) {
    return res.status(400).render("register", {
      error: "All fields are required.",
    });
  }

  try {
    const existingUserByName = await _findUserByUsername(username);
    const existingUserByEmail = await _findUserByEmail(email);

    if (existingUserByName)
      return res.status(400).render("register", {
        error: "Username already exists.",
      });

    if (existingUserByEmail)
      return res.status(400).render("register", {
        error: "Email already exists.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    await _register({
      username,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).render("index", {
      message: "User registered successfully",
      user: req.body,
      connectionWay: "register",
    });
  } catch (err) {
    console.error(`Error registering user: ${err.message}`);
    res.status(500).render("register", {
      error: "Internal Server Error.",
    });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await _findUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      req.session.user = user;

      res.status(200).render("index", {
        message: "User logged in successfully",
        user,
        connectionWay: "login",
      });
    } else {
      res.status(400).render("login", {
        error: "Invalid username or password",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render("login", {
      error: "Internal Server Error.",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await _getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(`Error fetching all users: ${err.message}`);
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
}

async function getAUser(req, res) {
  const { id } = req.params;
  try {
    const user = await _getAUser(id);

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(`Error fetching user: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

async function updateAUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  try {
    await _updateAUser(id, userData);
    res
      .status(200)
      .json({ message: `${userData.username} updated successfully` });
  } catch (err) {
    console.error(`Error updating user: ${err.message}`);
    if (
      err.message === "Email is already taken" ||
      err.message === "Username is already taken"
    ) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}

async function deleteAUser(req, res) {
  const { id } = req.params;

  try {
    const deleted = await _deleteAUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "User doesn't exist." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error(`Error deleting user: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
};
