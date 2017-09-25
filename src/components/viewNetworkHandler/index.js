// @flow
import React from 'react';
// $FlowFixMe
import hoistStatics from 'hoist-non-react-statics';

/*

Apollo NetworkStatus indicators:

1. loading: The query has never been run before and the request is now pending. A query will still have this network status even if a result was returned from the cache, but a query was dispatched anyway.

2. setVariables: If a query’s variables change and a network request was fired then the network status will be setVariables until the result of that query comes back. React users will see this when options.variables changes on their queries.

3. fetchMore: Indicates that fetchMore was called on this query and that the network request created is currently in flight.

4. refetch: It means that refetch was called on a query and the refetch request is currently in flight.

5. Unused.

6. poll: Indicates that a polling query is currently in flight. So for example if you are polling a query every 10 seconds then the network status will switch to poll every 10 seconds whenever a poll request has been sent but not resolved.

7. ready: No request is in flight for this query, and no errors happened. Everything is OK.

8. error: No request is in flight for this query, but one or more errors were detected.

*/

const viewNetworkHandler = Component => {
  const C = props => {
    const { data, wrappedComponentRef, ...remainingProps } = props;

    // safety check against the data prop not existing
    if (!data)
      return <Component {...remainingProps} ref={wrappedComponentRef} />;

    // if  the view is running a query for the first time, or the view has already mounted but the variables have changed, the component should be loading
    const isLoading = data.networkStatus === 1 || data.networkStatus === 2;
    const hasError = data.networkStatus === 8;

    return (
      <Component
        {...remainingProps}
        data={data}
        hasError={hasError}
        isLoading={isLoading}
        ref={wrappedComponentRef}
      />
    );
  };

  C.WrappedComponent = Component;
  return hoistStatics(C, Component);
};

export default viewNetworkHandler;
