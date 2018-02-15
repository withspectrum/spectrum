// // @flow
// import { getCustomer } from '../models/stripeCustomers';
// import { stripe } from 'shared/stripe'

// type CreateCustomerInput = {
//   administratorEmail: string,
//   communityId: string,
//   communityName: string,
// }

// type UpdateCustomerInput = {
//   administratorEmail: string,
//   communityId: string,
//   communityName: string,
// }

// type FirstSubscriptionInput = {
//   stripeCustomerId: string,
//   item: {
//     plan: string,
//     quantity: number
//   }
// }

// class StripeUtilClass {
//   customer = null

//   constructor (customerId: string) {
//     if (!customerId) return;
//     return this.setCustomer(customerId);
//   }

//   setCustomer = async (customerId: string) => {
//     return this.customer = await getCustomer(customerId);
//   }

//   hasChargeableSource = (): boolean => {
//     if (!this.customer) return false
//     return this.customer.sources.data.some(source => source.status === 'chargeable')
//   }

//   getActiveSubscription = (): ?Object => {
//     if (!this.customer) return null
//     return this.customer.subscriptions.data.find(sub => sub.status === 'active')
//   }

//   hasSubscriptionItemOfType = (type: string): boolean => {
//     if (!this.customer) return false
//     if (!this.getActiveSubscription()) return false
//     return this.customer.subscriptions.data.items.data.some(item => item.plan.id === type)
//   }

//   createCustomer = async (customer: CreateCustomerInput) => {
//     return await stripe.customers.create({
//       email: customer.administratorEmail,
//       metadata: {
//         communityId: customer.communityId,
//         communityName: customer.communityName,
//       },
//     });
//   }

//   updateCustomer = async (customer: UpdateCustomerInput) => {
//     return await stripe.customers.create({
//       email: customer.administratorEmail,
//       metadata: {
//         communityId: customer.communityId,
//         communityName: customer.communityName,
//       },
//     });
//   }

//   createFirstSubscription = async (subscription: FirstSubscriptionInput) => {
//     return await stripe.subscriptions.create({
//       customer: subscription.stripeCustomerId,
//       billing_cycle_anchor: 1,
//       items: [
//         // NOTE: We have to include this dummy item in order to prevent
//         // the top-level subscription from thinking it's about any
//         // specific feature
//         {
//           plan: 'community-features',
//           quantity: 1,
//         },
//         subscription.item,
//       ],
//     });
//   }

//   addSubscriptionItem =
// }

// export const StripeUtil = (customerId: string) => new StripeUtilClass(customerId);
