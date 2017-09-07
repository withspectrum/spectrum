# Server-side rendering

In production we server our React-based frontend (`src/`) server-side rendered, meaning we do an initial render on the server and send down static HTML, then rehydrate with the JS bundle.

## Developing SSR

When you develop Spectrum you're usually running two processes, `yarn run dev:client` for the frontend and `yarn run dev:server` for Iris, the GraphQL API. This means in your browser you access `localhost:3000`, which is a fully client-side React app, and that then fetches data from `localhost:3001/api`.

To test server-side rendering locally just load Spectrum from `localhost:3001` (instead of `:3000`), which will request the HTML from Iris rather than `webpack-dev-server`.

The upside of this setup is that we get the best development experience locally with hot module reloading etc, and in production we only have one SSR process.

The only downside is that when you're testing SSR and changing the frontend those changes won't be reflected. To get changes from the frontend reflected when you're requesting `localhost:3001` you have to:

1. Stop the `yarn run dev:client` process
2. Run `yarn run dev:client`
3. Wait for the first compilation to complete
4. Restart the `yarn run dev:server` process by stopping and then starting it again
