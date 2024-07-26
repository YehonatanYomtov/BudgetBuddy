const db = require("../config/db.js");

async function _register(userInfo) {
  try {
    const user = await db("users")
      .insert(userInfo)
      .returning(["id", "username"]);

    return user;
  } catch (err) {
    throw err.message;
  }
}

async function _findUserByUsername(username) {
  try {
    const user = await db("users")
      .where({ username })
      .select("id", "username", "email", "password_hash")
      .first();

    return user;
  } catch (err) {
    throw err.message;
  }
}

async function _findUserByEmail(email) {
  try {
    const user = await db("users")
      .where({ email })
      .select("username", "email", "password_hash")
      .first();

    return user;
  } catch (err) {
    throw err.message;
  }
}

async function _getAllUsers() {
  try {
    const user = await db("users").select(
      "id",
      "username",
      "email",
      "password_hash",
      "created_at"
    );

    return user;
  } catch (err) {
    throw err.message;
  }
}

async function _getAUser(id) {
  try {
    return await db("users").where({ id }).first();
  } catch (err) {
    throw err.message;
  }
}

async function _updateAUser(id, user) {
  const { username, email } = user;

  try {
    const oldUser = await db("users").where({ id }).first();

    if (email && email !== oldUser.email) {
      const existingEmail = await db("users").where({ email }).first();
      if (existingEmail) {
        throw new Error("Email is already taken");
      }
    }

    if (username && username !== oldUser.username) {
      const existingUsername = await db("users").where({ username }).first();
      if (existingUsername) {
        throw new Error("Username is already taken");
      }
    }

    await db("users").where({ id }).update({ username, email });
  } catch (err) {
    console.error(err);
    throw err.message;
  }
}

async function _deleteAUser(id) {
  try {
    return db("users").where({ id }).del();
  } catch (err) {
    console.error(err);
    throw err.message;
  }
}

async function _getProfileInfo(id) {
  try {
    const user = await db("users")
      .where({ id })
      .select("id", "username", "email", "created_at")
      .first();

    return user;
  } catch (err) {
    console.error(err);
    throw err.message;
  }
}

module.exports = {
  _register,
  _findUserByUsername,
  _findUserByEmail,
  _getAllUsers,
  _getAUser,
  _updateAUser,
  _deleteAUser,
  _getProfileInfo,
};
