// @flow
// ./__mocks__/axios.js
import {
  getContributorStatsUrl,
  SPECTRUM_OWNER,
  SPECTRUM_REPOSITORY,
} from '../../githubIntegration';
export const response = {
  data: [
    {
      author: {
        login: 'TestUser',
        id: 123123,
      },
    },
  ],
};

const axios = {
  get: jest.fn(url => {
    if (url === getContributorStatsUrl(SPECTRUM_OWNER, SPECTRUM_REPOSITORY)) {
      return Promise.resolve(response);
    }
  }),
};

export default axios;
