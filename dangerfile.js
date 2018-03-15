// @flow
import path from 'path';
import { warn, fail, message, markdown, schedule, danger } from 'danger';
import yarn from 'danger-plugin-yarn';
import jest from 'danger-plugin-jest';
import flow from 'danger-plugin-flow';
import noTestShortcuts from 'danger-plugin-no-test-shortcuts';
import noConsole from 'danger-plugin-no-console';

const APP_FOLDERS = [
  'admin',
  'athena',
  'chronos',
  'hermes',
  'hyperion',
  'iris',
  'mercury',
  'shared',
  'src',
  'vulcan',
];
const CHECKBOXES = /^\s*-\s*\[x\]\s*(.+?)$/gim;
const possibleAutoLabels = {
  wip: 'WIP: Building',
  'needs testing': 'WIP: Needs Testing',
  'ready for review': 'WIP: Ready for Review',
};

// Make sure people describe what their PR is about
if (danger.github.pr.body.length < 10) {
  fail('Please add a description to your PR.');
}

// Add automatic labels to the PR
schedule(async () => {
  const pr = danger.github.thisPR;
  const api = danger.github.api;
  const checkedBoxes = danger.github.pr.body.match(CHECKBOXES);
  if (!checkedBoxes || checkedBoxes.length === 0) return;

  const matches = checkedBoxes
    .map(result => new RegExp(CHECKBOXES.source, 'mi').exec(result))
    .filter(Boolean)
    .map(res => res[1]);

  const matchingLabels = matches
    .filter(
      match => Object.keys(possibleAutoLabels).indexOf(match.toLowerCase()) > -1
    )
    .map(key => possibleAutoLabels[key.toLowerCase()]);

  if (!matchingLabels || matchingLabels.length === 0) return;

  await api.issues.addLabels({
    owner: pr.owner,
    repo: pr.repo,
    number: pr.number,
    labels: matchingLabels,
  });
});

// Make sure the yarn.lock file is updated when dependencies get added and log any added dependencies
APP_FOLDERS.forEach(folder => {
  schedule(yarn(path.join(__dirname, folder, 'package.json')));
});

// Log test failures if there are any
jest();

// Make sure nobody does a it.only and blocks our entire test-suite from running
noTestShortcuts({
  testFilePredicate: filePath => filePath.endsWith('.test.js'),
});

schedule(noConsole({ whitelist: ['error'] }));

schedule(
  flow({
    // Fail on newly created untyped files
    created: 'fail',
    // Warn on modified untyped files
    modified: 'warn',
    blacklist: ['flow-typed/**/*.js', 'public/**/*.js'],
  })
);
