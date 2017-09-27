import React from 'react';
// $FlowFixMe
import hoistStatics from 'hoist-non-react-statics';

/*

This HOC can be used to wrap any component that is performaing data queries with Apollo. It will return human-readable props that indicate the status of the query. For example, in your component rather than writing:

if (networkStatus === 3) {
  ...
}

You can no write:

if (isFetchingMore) {
  ...
}

If you need to override this at any point, the original data prop is returned as well, so in your component you can still access this.props.data.networkStatus.


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

    // 1: if  the view is running a query for the first time
    // 2: the view has already mounted but the variables have changed, the component should be loading. For example, if you are viewing a user profile but click directly onto another user's profile from a thread facepile, the userProfile component has already loaded, but now the variable (userId) has been changed. This should force a loading state.
    const isLoading = data.networkStatus === 1 || data.networkStatus === 2;
    const queryVarIsChanging = data.networkStatus === 2;
    const isFetchingMore = data.networkStatus === 3;
    const isRefetching = data.networkStatus === 4;
    const isPolling = data.networkStatus === 6;
    const hasError = data.networkStatus === 8;

    return (
      <Component
        {...remainingProps}
        data={data}
        hasError={hasError}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        isRefetching={isRefetching}
        isPolling={isPolling}
        queryVarIsChanging={queryVarIsChanging}
        ref={wrappedComponentRef}
      />
    );
  };

  C.WrappedComponent = Component;
  return hoistStatics(C, Component);
};

export default viewNetworkHandler;
