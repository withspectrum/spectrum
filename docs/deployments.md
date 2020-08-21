[Table of contents](./readme.md)

# Deployments

We use [`now`](https://now.sh) by Vercel for all of our deployments.

### Installation

We recommend installing the [now desktop app](http://vercel.co/download) as it'll keep the command line tool up to date automatically!

If you'd rather not install an app (or are using Windows Substem for Linux) you can also install now with npm:

```
npm install -g now
```

### Naming scheme

All our workers are aliased to `<workername>.workers.spectrum.chat`, with the one exception being the API (the API server) which runs at `api.spectrum.chat`.

#### Path aliases

[Now's path alias feature](https://vercel.co/docs/features/path-aliases) takes care of routing requests to the right workers. To see our current production aliases check the `rules.json` file in the root of the project.

To deploy new rules, simply run the following command: (assuming `rules.json` has the changes)

```sh
now alias spectrum.chat -r rules.json
```

The same command with a different URL and slightly adapted rules can also be used to create an alpha/beta/staging/... version of the site.

### Frontend and Hyperion

Since the frontend is the part that changes the most often the repo is set up such that typing `now` in the root directory will deploy the frontend with hyperion. (the server-side rendering worker)

#### Deploying

First, make sure you're in the Space Program `now` team:

```
now switch spaceprogram
```

> Note: If you haven't been added to the now team yet ask one of your coworkers to add you!

Second, deploy a new version of the app:

```
now
```

This will do an _immutable deploy_ of the hyperion and will return a unique URL that this specific version is accessible at. (something like `spectrum-grtertb34.now.sh`)

Third, test that version of the app to make sure the new feature(s) work(s) as expected in production. Note that nobody except for people will access to the unique URL from the last step can access it at this point.

Fourth, if you're happy with the new feature(s) alias your unique URL to `hyperion.workers.spectrum.chat` to make it immediately available to all users:

```
now alias spectrum-grtertb34.now.sh hyperion.workers.spectrum.chat
```

And that's it, you've now deployed a new version of hyperion and the frontend!

### Other workers

We use [`backpack`](https://github.com/palmerhq/backpack) to get a nice development setup and build process in place for our workers. Since this is a mono-repo and `now` doesn't have any special functionality to handle monorepos we have to deploy the _built_ version of the workers. (compared to the frontend deploy where you deploy the raw code which gets built on the server)

#### Deploying

First, build the worker you want to deploy to get a bundle with the newest code rather than deploying a stale version:

```sh
yarn run build:<workername>
```

> Note: Replace `<workername>` with the name of the worker you want to deploy

Then deploy the `build-<workername>` folder with `now`:

```sh
now build-<workername>
```

As an example, to deploy `athena` I'd run these commands:

```sh
# First:  Build the worker
yarn run build:athena
# Second: Deploy the built bundle
now build-athena
```

This will give you an immutable deploy with a unique URL of this worker, something like `https://build-athena-ahsgut23sdyf.now.sh`.

#### Replacing the old deploy

Since we want to keep the workers alive even if nobody sends a request to their healthcheck endpoints we alias them to `<workername>.workers.spectrum.chat`. This ensures `now` overrides the older deploy and only the newest code is running.

To alias your deploy run `now alias`:

```sh
now alias <uniqueurl>.now.sh <workername>.workers.spectrum.chat
```

For example, for our `athena` deploy from above this would be:

```sh
now alias build-athena-ahsgut23sdyf.now.sh athena.workers.spectrum.chat
```
