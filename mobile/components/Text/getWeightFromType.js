// @flow
import type { WeightTypes } from './';

export default (type: WeightTypes) => {
  switch (type) {
    case 'thin':
      return '100';
    case 'ultraLight':
      return '200';
    case 'light':
      return '300';
    case 'regular':
      return '400';
    case 'medium':
      return '500';
    case 'semibold':
      return '600';
    case 'bold':
      return '700';
    case 'heavy':
      return '800';
    case 'black':
      return '900';
    default:
      return '400';
  }
};
