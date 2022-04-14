// Redirect any route ?thread=<id> or ?t=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
  const threadId = req.query.thread || req.query.t;

  if (threadId) {
    if (req.query.m) {
      res.redirect(`/thread/${threadId}?m=${req.query.m}`);
    } else {
      res.redirect(`/thread/${threadId}`);
    }
  } else {
    next();
  }
};

export default threadParamRedirect;
