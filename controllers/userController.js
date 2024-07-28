const bcrypt = require("bcrypt");

const {
  _register,
  _findUserByUsername,
  _findUserByEmail,
  _getAllUsers,
  _getAUser,
  _updateAUser,
  _deleteAUser,
  _getProfileInfo,
} = require("../models/userModel.js");

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUserByName = await _findUserByUsername(username);
    const existingUserByEmail = await _findUserByEmail(email);

    if (existingUserByName) {
      if (existingUserByEmail) {
        return res
          .status(400)
          .json({ error: "Username and Email already taken." });
      } else {
        return res.status(400).json({
          error: "Username already taken.",
        });
      }
    }

    if (existingUserByEmail)
      return res.status(400).json({ error: "Email already taken." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await _register({
      username,
      email,
      password_hash: hashedPassword,
    });

    req.session.user = user[0];

    res.status(201).redirect("/");
  } catch (err) {
    console.error(`Error registering user: ${err.message}`);
    res.status(500).json({
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

      res.status(200).json({
        message: "User logged in successfully.",
      });
    } else {
      res.status(400).json({
        error: "Invalid username or password",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
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

async function getProfileInfo(req, res) {
  const { id } = req.params;

  try {
    const userInfo = await _getProfileInfo(id);

    if (!userInfo) {
      return res.status(404).json({ error: "Profile doesn't exist." });
    }

    //* Can place in a util function
    const createdAt = new Date(userInfo.created_at);
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getDate()).padStart(2, "0");

    const user = { ...userInfo, created_at: `${day}-${month}-${year}` };

    res.status(200).render("profile", { user });
  } catch (err) {
    console.error(
      `Error fetching profile info of current user: ${err.message}`
    );
    res.status(500).json({ error: "Internal Server Error." });
  }
}

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Unable to log out." });
    }
    res.redirect("/login");
  });
}

module.exports = {
  register,
  login,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
  getProfileInfo,
  logout,
};
