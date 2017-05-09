// @flow
import { getFrequencies } from '../models/frequency';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createFrequencyLoader = () =>
  createLoader(frequencies => getFrequencies(frequencies));

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
