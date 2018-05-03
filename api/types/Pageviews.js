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

  type PageViewRefererData {
    refererDomain: String!
    views: Int!
  }

  enum PageViewResolution {
    day
    week
  }
  
  type PageViewResult {
    resolution: PageViewResolution!
    data: [PageViewData]!
    refererData: [PageViewRefererData]!
  }

  extend type Mutation {
    addPageView(input: AddPageViewInput!): Boolean
  }
`;

module.exports = Pageviews;
