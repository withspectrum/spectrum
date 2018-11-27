// @flow
import { ApolloLink } from 'apollo-link';
import type { Operation } from 'apollo-client';
import type { Observable } from 'zen-observable';

class RefetchCountLink extends ApolloLink {
  constructor() {
    super();
    this.queries = {};
    this.loading = 0;
  }

  request<I: Operation>(operation: I, forward: (op: I) => Observable) {
    const operationType = operation.query.definitions.find(
      def => def.kind === 'OperationDefinition'
    ).operation;
    if (operationType === 'subscription') return forward(operation);

    const observable = forward(operation);
    const key = operation.toKey();
    if (!this.queries[key]) {
      this.queries[key] = true;
      return observable;
    }
    const self = this;
    self.loading++;
    console.log(
      `Refetching a query. Refetching ${self.loading} queries right now`
    );

    observable.subscribe({
      error() {
        self.loading--;
        console.log(
          `Refetching query errored. Refetching ${
            self.loading
          } queries right now`
        );
      },
      complete() {
        self.loading--;
        console.log(`Refetched query, refetching ${self.loading} queries`);
      },
    });

    return observable;
  }
}

export default RefetchCountLink;
