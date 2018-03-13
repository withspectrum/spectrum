// @flow
const S3 = /* GraphQL */ `
  enum S3EntityType {
    communities
    channels
    users
    threads
  }

  input GetSignedS3UrlInput {
    objectName: String!
    contentType: String!
    entityType: S3EntityType!
    id: String!
  }

  type SignedS3Type {
    signedUrl: String
    filename: String
    originalFilename: String
    publicUrl: String
  }

	extend type Mutation {
		getSignedS3Url(input: GetSignedS3UrlInput!): SignedS3Type
	}
`;

module.exports = S3;
