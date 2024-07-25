function checkUser(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.render("login");
  }
}

module.exports = { checkUser };
