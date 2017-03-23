# `<InfiniteList />`

A list of data, can either exist already or be lazily loaded. (infinite loading style) Uses `react-virtualized` under the hood.

## Props

- **`height`** (number): The height of the list
- **`width`** (number): The height of the list
- **`elementRenderer`** (function): A function (`({ index, key })`) that should be used to render a single element of the list. Will be called repeatedly.
- `keyMapper` (function): A function (`(index)`) which should return a unique key for each element based on the index. (e.g. the ID of the element at that index) This avoids issues with empty holes in the list when reordering for example.
- `elementCount` (number): The number of elements in the list. When lazy loading either set this to the full length of the remote data (!) or leave it out.
- `isElementLoaded` (function): A function (`({ index })`) which should return true or false depending on if the item is loaded already
- `loadMoreElements` (function): A function (`({ startIndex, stopIndex })`) which should return a Promise and should resolve when the data between those indexes has been loaded

Note that `isElementLoaded` and `loadMoreElements` are only necessary if you want to lazily load the data for the elements when it's needed.
