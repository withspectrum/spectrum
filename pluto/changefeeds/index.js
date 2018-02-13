// @flow
import {
  newCommunity,
  editedCommunity,
  deletedCommunity,
  newAdministratorEmail,
} from './community';

/*

  The changefeeds here are how we init conversations with Stripe from events
  on Spectrum. The only things we want to do here are keep Stripe up to date
  with changing community content on the platform; all other conversations
  to Stripe will happen in Iris (e.g. adding a source)

*/

export default () => {
  newCommunity();
  editedCommunity();
  deletedCommunity();
  newAdministratorEmail();
};
