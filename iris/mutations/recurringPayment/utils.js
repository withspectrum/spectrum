// @flow
export const parseStripeErrors = err => {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return new UserError(err); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return new UserError(
        'Could not upgrade to Pro at this time, try again later: 1'
      );
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return new UserError(
        'Could not upgrade to Pro at this time, try again later: 2'
      );
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      return new UserError(
        'Something went wrong at Stripe, try again later: 3'
      );
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      return new UserError(
        'Something went wrong at Stripe, try again later: 4'
      );
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      return new UserError(
        'Something went wrong at Stripe, try again later: 5'
      );
      break;
    default:
      // Handle any other types of unexpected errors
      return new UserError('Something went wrong, try again later: 6');
      break;
  }
};

export const getStripeCustomer = (customerId: string) => {
  try {
    return stripe.customers.retrieve(customerId);
  } catch (err) {
    return console.log(err) || err;
  }
};

export const createStripeCustomer = (email: string, source: string) => {
  try {
    return stripe.customers.create({
      email,
      source,
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

export const updateStripeCustomer = (customer, email, source) => {
  try {
    return stripe.customers.update(customer, {
      email,
      source,
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

export const createStripeSubscription = (
  customer: string,
  plan: string,
  quantity: number
) => {
  try {
    return stripe.subscriptions.create({
      customer,
      items: [
        {
          plan,
          quantity: quantity ? quantity : 1, // if no quantity is provided, default to one
        },
      ],
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

export const deleteStripeSubscription = (subscription: string) => {
  try {
    return stripe.subscriptions.del(subscription);
  } catch (err) {
    return console.log(err) || err;
  }
};
