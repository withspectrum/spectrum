// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getUserByEmail, setUserPendingEmail } from '../../models/user';
import isEmail from 'validator/lib/isEmail';
import { sendEmailValidationEmailQueue } from 'shared/bull/queues';

export default async (
  _: any,
  { email }: { email: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to update your email address');
  }

  if (!isEmail(email)) {
    return new UserError('Please enter a working email address');
  }

  const result = await getUserByEmail(email);

  if (result && result.email === email) {
    return new UserError(
      'Another person on Spectrum is already using this email.'
    );
  }

  return setUserPendingEmail(user.id, email)
    .then(user => {
      sendEmailValidationEmailQueue.add({ email, userId: user.id });
      return user;
    })
    .catch(
      err =>
        new UserError(
          "We weren't able to send a confirmation email. Please try again."
        )
    );
};
