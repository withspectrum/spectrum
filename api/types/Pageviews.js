// @flow

const Pageviews = /* GraphQL */ `
  enum PageViewType {
    COMMUNITY
    THREAD
    CHANNEL
  }

  input AddPageViewInput {
		id: String!
    refererURL: String
    pageviewType: PageViewType!
	}

  extend type Mutation {
    addPageView(input: AddPageViewInput!): Boolean
  }
`;

module.exports = Pageviews;
