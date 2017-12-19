// Redirect any route ?thread=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
  console.log(req);
  // Redirect /?t=asdf123 if the user isn't logged in
  if (!req.user && req.query.t) {
    console.log('redirect 5');
    res.redirect(`/thread/${req.query.t}`);
    // Redirect /anything?thread=asdf123
  } else if (req.query.thread) {
    console.log('redirect 6');
    res.redirect(`/thread/${req.query.thread}`);
  } else {
    console.log('redirect 7');
    next();
  }
};

export default threadParamRedirect;
