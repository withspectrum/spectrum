[Table of contents](../readme.md) / [Hyperion](./intro.md)

# Hyperion development

### Normal development workflow

When you develop Spectrum you're running two processes, `yarn run dev:web` for the frontend and `yarn run dev:api` for API, the GraphQL API. This means in your browser you access `localhost:3000`, which is a fully client-side React app, and that then fetches data from `localhost:3001/api`.

In production, the client-side app is bundled and server-side rendered by Hyperion.

This means we get the best development experience locally with hot module reloading etc, and in production we have single server responsible for serving files, rendering and the API.

### When developing SSR 

**DO NOT USE THIS UNLESS YOU'RE DEVELOPING SSR**

To test server-side rendering locally run the client and the API locally, and then start Hyperion with `yarn run dev:hyperion`. Open Hyperion's URL, `http://localhost:3006` (instead of `:3000`), which will request the server-side rendered HTML from Hyperion rather than `webpack-dev-server`.

The downside is that when you're testing SSR and changing the frontend those changes won't be reflected immediately. To get changes from the frontend when you're requesting `localhost:3001` you have to:

1. Stop the `yarn run dev:web` process
2. Run `yarn run dev:web`
3. Wait for the first compilation to complete
4. Restart the `yarn run dev:hyperion` process by stopping and then starting it again

## When doing all other client development

Just stick to the normal workflow of `yarn run dev:web` and enjoy the hot reloading at `localhost:3000`!
