// @flow

export default (
  _: any,
  { email }: { email: string },
  { user }: { user: DBUser }
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to update your email address');
  }

  return getUserByEmail(email).then(result => {
    if (result && result.email === email) {
      return new UserError(
        'Another person on Spectrum is already using this email.'
      );
    }

    return setUserPendingEmail(user.id, email)
      .then(user => {
        addQueue('send email validation email', { email, userId: user.id });
        return user;
      })
      .catch(
        err =>
          new UserError(
            "We weren't able to send a confirmation email. Please try again."
          )
      );
  });
};
