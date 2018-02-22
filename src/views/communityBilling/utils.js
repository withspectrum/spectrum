// @flow

export const getCardImage = (brand: string) => {
  switch (brand) {
    case 'Visa':
      return '/img/payment-methods/visa.svg';
    case 'Discover':
      return '/img/payment-methods/discover.svg';
    case 'Diners Club':
      return '/img/payment-methods/diners-club.svg';
    case 'MasterCard':
      return '/img/payment-methods/mastercard.svg';
    case 'American Express':
      return '/img/payment-methods/amex.svg';
    case 'JCB':
      return '/img/payment-methods/jcb.svg';
    default:
      return '/img/payment-methods/card-unknown.svg';
  }
};

export const formatNumbersToDollars = (amount: number): string =>
  (amount / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
