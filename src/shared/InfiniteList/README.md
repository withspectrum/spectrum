# `<InfiniteList />`

A list of data, can either exist already or be lazily loaded. (infinite loading, twitter/facebook-feed style) Uses `react-virtualized` under the hood.

## Props

- **`elementRenderer`** (function): A function (`({ index, key })`) that should be used to render a single element of the list. Will be called repeatedly.
- `keyMapper` (function): A function (`(index)`) which should return a unique key for each element based on the index. (e.g. the ID of the element at that index) This avoids issues with empty holes in the list when reordering for example.
- `elementCount` (number): The number of elements in the list. When lazy loading either set this to the full length of the remote data (!) or leave it out.
- `hasNextPage` (boolean): Should be true if there's another page of data to be loaded
- `loadNextPage` (function): A function (`({ startIndex, stopIndex })`) which should return a Promise and should resolve when the data between those indexes has been loaded and added to the data source
- `isNextPageLoading` (boolean): Should be true while `loadNextPage` is loading a new page.
- `loadingIndicator` (React element): A React element to show at the bottom of the list while loading new elements.

Note that `hasNextPage`, `loadNextPage` and `isNextPageLoading` are necessary (and only necessary) if you do pagination.
