// @flow

const Pageviews = /* GraphQL */ `
  enum PageViewType {
    community
    thread
    channel
  }

  input AddPageViewInput {
		id: String!
    refererURL: String
    pageviewType: PageViewType!
  }
  
  type PageViewData {
    date: String!
    views: Int!
  }

  extend type Mutation {
    addPageView(input: AddPageViewInput!): Boolean
  }
`;

module.exports = Pageviews;
