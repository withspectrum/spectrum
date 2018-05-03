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

  enum PageViewResolution {
    day
    week
  }
  
  type PageViewResult {
    resolution: PageViewResolution!
    data: [PageViewData]!
  }

  extend type Mutation {
    addPageView(input: AddPageViewInput!): Boolean
  }
`;

module.exports = Pageviews;
