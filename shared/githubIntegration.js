import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
const SPECTRUM_OWNER = 'withspectrum';
const SPECTRUM_REPOSITORY = 'spectrum';

export const isContributor = (githubLogin: string, githubId: string) => {
  return getContributorStats()
    .then(contributors => {
      const filtered = contributors.filter(contributor =>
        isSameUser(contributor.author, githubLogin, githubId)
      );
      return filtered && filtered.length > 0 && filtered[0] !== null;
    })
    .catch(err => {
      const message = `Error when trying to check if user ${githubLogin} is contributor`;
      console.log(message, err);
      return new Error(message);
    });
};

export const getContributorStats = () =>
  axios
    .get(getContributorStatsUrl(SPECTRUM_OWNER, SPECTRUM_REPOSITORY))
    .then(response => response.data)
    .catch(
      err =>
        new Error(
          'Error retrieving contributor stats from Github REST API for Spectrum'
        )
    );

const getRepositoryUrl = (owner, repositoryName) =>
  `${GITHUB_API_URL}/repos/${owner}/${repositoryName}`;
const getContributorStatsUrl = (owner, repositoryName) =>
  `${getRepositoryUrl(owner, repositoryName)}/stats/contributors`;
const isSameUser = (author, username, id) =>
  author.login === username && author.id === parseInt(id);
