// @flow
// Redirect any route ?thread=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
  if (req.query.thread && typeof req.query.thread === 'string') {
    res.redirect(`/thread/${req.query.thread}`);
  } else {
    next();
  }
};

export default threadParamRedirect;
