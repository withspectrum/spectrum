# Desktop

**This folder contains all sources used to build spectrum desktop application.**

The project uses [Electron](https://electronjs.org/) to build cross platform desktop apps with JavaScript, HTML, and CSS.

## Directory Structure

* `release/` - the release build for each platform (mac, win, linux).
* `resources/` - the resources folder (icons, images ...).
* `src/` the source code of electron application.
* `package.json` - dependencies & devdependencies.
* `yarn.lock` - Yarn lockfile to get consistent installs across machine.

## Scripts

The project uses [Electron-builder](https://www.electron.build/)  to package & build a ready for distribution Electron app for macOS, Windows and Linux with “auto update” support out of the box.

* `dev` - run electron app in development mode.
* `package` - Build unpacked dir. Useful to test.
* `package:<target>` build electron app for target platform (mac, linux, win).
* `package:all` - build electron app for all platform.
* `ship` - build and publish artifacts (to GitHub Releases). See https://goo.gl/tSFycD
