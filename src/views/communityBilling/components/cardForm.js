// @flow
import * as React from 'react';
import {
  StripeProvider,
  Elements,
  injectStripe,
  CardElement,
} from 'react-stripe-elements';
import { SERVER_URL, PUBLIC_STRIPE_KEY } from '../../../api/constants';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';

type Props = {
  community: GetCommunitySettingsType,
};

type FormProps = {
  stripe: Object,
  community: GetCommunitySettingsType,
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
      .createSource()
      .then(({ source }) => {
        console.log('JSON.stringify(source)', JSON.stringify(source));
        return fetch(`${SERVER_URL}/api/stripe/updateSource`, {
          body: JSON.stringify({
            source: JSON.stringify(source),
            communityId: this.props.community.id,
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      })
      .then(response => response.json())
      .then(json => console.log('got back something', json))
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
          <FormWithStripe community={this.props.community} />
        </Elements>
      </StripeProvider>
    );
  }
}

export default CardForm;
