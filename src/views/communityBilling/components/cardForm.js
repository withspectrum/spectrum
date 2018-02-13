// @flow
import * as React from 'react';
import {
  StripeProvider,
  Elements,
  injectStripe,
  CardElement,
} from 'react-stripe-elements';
import { PUBLIC_STRIPE_KEY } from '../../../api/constants';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';

type Props = {
  community: GetCommunitySettingsType,
};

type FormProps = {
  stripe: Object,
};

type State = {
  stripe: ?any,
};

const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontSmoothing: 'antialiased',
    fontSize: '18px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

class Form extends React.Component<FormProps> {
  handleSubmit = ev => {
    ev.preventDefault();

    this.props.stripe
      .createToken()
      .then(({ token }) => {
        console.log('Received Stripe token:', token);
        return;
      })
      .catch(err => {
        console.log('Error creating token', err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement style={style} />
        <button>Submit</button>
      </form>
    );
  }
}

const FormWithStripe = injectStripe(Form);

//
//
//

class CardForm extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { stripe: null };
  }

  componentDidMount() {
    // componentDidMount only runs in a browser environment.
    // In addition to loading asynchronously, this code is safe to server-side render.

    // You can inject a script tag manually like this,
    // or you can use the 'async' attribute on the Stripe.js v3 <script> tag.
    const stripeJs = document.createElement('script');
    stripeJs.src = 'https://js.stripe.com/v3/';
    stripeJs.async = true;
    stripeJs.onload = () => {
      this.setState({
        stripe: window.Stripe(PUBLIC_STRIPE_KEY),
      });
    };
    document.body && document.body.appendChild(stripeJs);
  }

  render() {
    const { stripe } = this.state;
    return (
      <StripeProvider stripe={stripe}>
        <Elements>
          <FormWithStripe />
        </Elements>
      </StripeProvider>
    );
  }
}

export default CardForm;
