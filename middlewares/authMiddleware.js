function checkUser(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = { checkUser };
