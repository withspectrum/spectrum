const Invoice = /* GraphQL */ `
	type Invoice {
		id: ID!
    createdAt: Date!
    amount: Int
		paidAt: Date
		note: String!
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
