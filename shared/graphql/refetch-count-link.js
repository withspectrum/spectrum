// @flow
import { ApolloLink } from 'apollo-link';
import type { Operation } from 'apollo-client';

// TODO
type Observable = any;

type Options = {
  onRefetching: () => void,
  onRefetchFinished: () => void,
};

class RefetchCountLink extends ApolloLink {
  constructor(options: Options) {
    super();
    this.queries = {};
    this.loading = 0;
    this.options = options;
  }

  request<I: Operation>(operation: I, forward: (op: I) => Observable) {
    const operationType = operation.query.definitions.find(
      def => def.kind === 'OperationDefinition'
    ).operation;
    if (operationType === 'subscription') return forward(operation);
    console.log(operation.getContext());

    const observable = forward(operation);
    const key = operation.toKey();
    if (!this.queries[key]) {
      this.queries[key] = true;
      return observable;
    }
    console.log(key);
    const self = this;
    self.loading++;
    if (self.loading === 1) {
      this.options.onRefetching();
    }

    const handleFinish = () => {
      self.loading--;
      if (self.loading === 0) {
        self.options.onRefetchFinished();
      }
    };

    observable.subscribe({
      error: handleFinish,
      complete: handleFinish,
    });

    return observable;
  }
}

export default RefetchCountLink;
