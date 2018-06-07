# Desktop App Deployment

1. Packages the desktop app for all operating systems and upload them to GitHub as a draft release with the following command: 

  ```
  GH_TOKEN=xyz123 yarn run release:desktop
  ```

> Note: GH_TOKEN has to be a valid GitHub personal token. You can get one from your user settings.
> Note for employees: You will find the company GitHub token in 1Password under the entry for "Spectrum GitHub Bot"

2. You'll then have a draft release on GitHub that looks something like this:

  ![screen shot 2018-05-30 at 15 42 22](https://user-images.githubusercontent.com/7525670/40724411-4b5fe9ec-6421-11e8-8e4b-d0df96b46f72.png)

3. Go to that draft release, download the build for your OS and test the new version locally.

4. If you're happy with how it works, click the "Edit" button on the draft release and you get to this screen:

  ![screenshot-2018-5-30 withspectrum spectrum](https://user-images.githubusercontent.com/7525670/40724488-77256642-6421-11e8-9911-999ed0fa5957.png)

4. Fill out the title and release notes of the release (like it's already done above), then click "Publish release".

As soon as it's published, the app will prompt existing users to upgrade to the newest version and download and install it for them.

