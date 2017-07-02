# Deployment

## Frontend and Iris

We use [`now`](https://now.sh) by Zeit for deploying iris, our web server. (and frontend) This makes deploying a new version of our app easy as pie!

### Installation

We recommend installing the [now desktop app](http://zeit.co/download) as it'll keep the command line tool up to date automatically!

If you'd rather not install an app (or are using Windows Substem for Linux) you can also install now with npm:

```
npm install -g now
```

### Deploying

First, make sure you're in the Space Program `now` team:

```
now switch
```

> Note: If you haven't been added to the now team yet ask one of your coworkers to add you!

Second, deploy a new version of the app:

```
now
```

This will do an _immutable deploy_ of the app and will return a unique URL that this specific version is accessible at. (something like `spectrum-grtertb34.now.sh`)

Third, test that version of the app to make sure the new feature(s) work(s) as expected in production. Note that nobody except for people will access to the unique URL from the last step can access it at this point.

Fourth, if you're happy with the new feature(s) alias your unique URL to `spectrum.chat` to make it immediately available to all users:

```
now alias spectrum-grtertb34.now.sh spectrum.chat
```

And that's it, you've now deployed a new version of iris and the frontend!

## Workers

Both athena and hermes are hosted manually in the cloud on AWS EC2 boxes. The machines run Ubuntu 16.04 and are accessible via SSH. Deployment happens manually via SCP and SSH using [`forever`](https://npm.im/forever) to run the processes, well, forever!

### Getting an SSH key

You need a private SSH key to connect to the machines which you can find in the shared 1Password under "AWS EC2 private SSH key". Copy the text to a file called `aws.pem` in your `~/.ssh` folder.

### Getting the URL

Each machine has a unique URL that you need to connect. Open the [AWS EC2 dashboard](https://console.aws.amazon.com/ec2/v2/home), click on the worker you want to deploy and copy the `amazonaws` URL.

### Uploading the new files

To upload the newest build to the worker run this set of commands:

```sh
# Build a fresh version of the worker with the latest code
npm run build:<worker> # e.g. build:athena
# Upload the latest code with scp
scp -i ~/.ssh/aws.pem -r build-<worker> ubuntu@<url>:~/<commit hash>
```

Make sure to replace `<worker>` with the worker name, `<url>` with the URL you copied in the last step and `<commit hash>` with the six character hash of the latest commit. This is what a full command might look like: (note: this is pseudo, this is not what you should actually run)

```
scp -i ~/.ssh/aws.pem -r build-athena ubuntu@c2-98-124-34-85.compute-1.amazonaws.com:~/hgu89t
```

### Running the new version of the code

To run the new version of the code you'll have to SSH into the machine, start the new version and then stop the old version.

First, connect to the server:

```
ssh -i ~/.ssh/aws.pem ubuntu@<url>
```

Replace `<url>` with the copied URL again.

Once you're connected start the new version of the code with `forever`:

```
forever start ~/<commit hash>/index.js
```

> Note: Depending on the worker you might need to run `npm install` in the new folder first.

Once that's running without errors stop the old version by running

```sh
# Get a list of all running worker processes
forever list
# Find the one that points to the old folder and copy its PID
# Stop the old process by PID
forever stop <pid>
```

This is a pretty manual process but we're looking to improve it in the future.
