// @flow
import mockAxios from 'jest-mock-axios';
import { isContributor, getContributorStats } from '../githubIntegration';

afterEach(() => {
  // clean up mock axios for each test
  mockAxios.reset();
});

describe('Github integration', () => {
  it('Should check if user is contributor for Spectrum', () => {
    const thenFn = jest.fn();
    const catchFn = jest.fn();
    const login = 'TestUser';
    const id = '123123';

    isContributor(login, id)
      .then(thenFn)
      .catch(catchFn);

    const response = { data: [{ author: { login, id } }] };
    mockAxios.mockResponse(response);

    expect(mockAxios.get).toHaveBeenCalled();
    expect(thenFn).toHaveBeenCalled();
    expect(catchFn).not.toHaveBeenCalled();
  });

  it('Should return github contributors stats for Spectrum', () => {
    const expectedUrl =
      'https://api.github.com/repos/withspectrum/spectrum/stats/contributors';
    const thenFn = jest.fn();
    const catchFn = jest.fn();

    getContributorStats()
      .then(thenFn)
      .catch(catchFn);

    const response = { data: [{ author: {} }] };
    mockAxios.mockResponse(response);

    expect(mockAxios.get).toHaveBeenCalledWith(expectedUrl);
    expect(thenFn).toHaveBeenCalled();
    expect(catchFn).not.toHaveBeenCalled();
  });
});
