// @flow
import axios, { response } from './__mocks__/axios';
import {
  getContributorStatsUrl,
  SPECTRUM_OWNER,
  SPECTRUM_REPOSITORY,
  isContributor,
  getContributorStats,
} from '../githubIntegration';

describe('Github integration', () => {
  it('Should check if user is contributor for Spectrum', async () => {
    const expectedUrl = getContributorStatsUrl(
      SPECTRUM_OWNER,
      SPECTRUM_REPOSITORY
    );
    const login = 'TestUser';
    const id = '123123';

    const result = await isContributor(login, id);

    expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBe(true);
  });

  it('Should return github contributors stats for Spectrum', async () => {
    const expectedUrl = getContributorStatsUrl(
      SPECTRUM_OWNER,
      SPECTRUM_REPOSITORY
    );

    const result = await getContributorStats();

    expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBe(response.data);
  });
});
