// Redirect any route ?thread=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
  // Redirect /?t=asdf123 if the user isn't logged in
  if (!req.user && req.query.t) {
    res.redirect(`/thread/${req.query.t}`);
    // Redirect /anything?thread=asdf123
  } else if (req.query.thread) {
    res.redirect(`/thread/${req.query.thread}`);
  } else {
    next();
  }
};

export default threadParamRedirect;
