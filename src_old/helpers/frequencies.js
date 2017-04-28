import { FREQUENCIES } from './regexps';

export const getCurrentFrequency = (
  activeFrequency,
  frequencies,
  communityId
) => {
  if (activeFrequency === 'everything') {
    return;
  }

  return frequencies.find(
    freq =>
      (freq.slug === activeFrequency && communityId === freq.communityId) ||
      freq.id === activeFrequency
  );
};

export const getFrequencyPermission = (user, activeFrequency, frequencies) => {
  let frequencyToEval = getCurrentFrequency(activeFrequency, frequencies);
  if (!frequencyToEval) return;

  let frequencyUsers = frequencyToEval.users;
  // make sure this user is viewing a frequency they have joined
  if (!frequencyUsers[user.uid]) return;
  let usersPerm = frequencyUsers[user.uid].permission;
  return usersPerm;
};

export const linkFreqsInMd = (text, community) => {
  return text.replace(
    FREQUENCIES,
    `$1[$2](https://spectrum.chat/${community}/$2)`
  );
};

export const groupFrequencies = frequencies => {
  const grouped = {};
  frequencies.forEach(frequency => {
    const { communityId } = frequency;
    if (!grouped[communityId]) grouped[communityId] = [];
    grouped[communityId].push(frequency);
  });
  return grouped;
};
