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
  
  type PageView {
    createdAt: Date
    refType: PageViewType!
    refId: ID!
    refererDomain: String
  }

  extend type Mutation {
    addPageView(input: AddPageViewInput!): Boolean
  }
`;

module.exports = Pageviews;
