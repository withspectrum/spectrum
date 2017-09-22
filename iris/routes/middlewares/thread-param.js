// @flow
// Redirect any route ?thread=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
  const hasThreadParam =
    req.query.thread && typeof req.query.thread === 'string';
  const hasTParam = req.query.t && typeof req.query.t === 'string';
  const threadId = hasThreadParam
    ? req.query.thread
    : hasTParam ? req.query.t : null;

  if (hasThreadParam || hasTParam) {
    res.redirect(`/thread/${threadId}`);
  } else {
    next();
  }
};

export default threadParamRedirect;
