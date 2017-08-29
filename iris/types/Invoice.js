const Invoice = /* GraphQL */ `
	type Invoice {
		id: ID!
    paidAt: Int
    amount: Int
		sourceBrand: String
		sourceLast4: String
		planName: String
	}

	extend type Query {
    invoice(id: ID): Invoice
  }

  input PayInvoiceInput {
		id: ID!
		token: String!
	}

	extend type Mutation {
		payInvoice(input: PayInvoiceInput!): Invoice
	}
`;

module.exports = Invoice;
