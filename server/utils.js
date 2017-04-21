// Case and return the proper error to the client
const returnPaymentsError = (res, err) => {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return res.json({ success: false, error: err.message }); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return res.json({ success: false });
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return res.json({ success: false });
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    default:
      // Handle any other types of unexpected errors
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
  }
};

module.exports = {
  returnPaymentsError,
};
