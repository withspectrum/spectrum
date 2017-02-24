export const getFrequencyPermission = (user, activeFrequency, frequencies) => {
  const { uid } = user;
  if (!uid || activeFrequency === 'everything') {
    return;
  }

  let frequencyToEval = frequencies.filter(freq => {
    return freq.slug === activeFrequency;
  });

  if (frequencyToEval.length < 1) return;
  let frequencyUsers = frequencyToEval[0].users;
  // make sure this user is viewing a frequency they have joined
  if (!frequencyUsers[uid]) return;
  let usersPerm = frequencyUsers[uid].permission;
  return usersPerm;
};

export const getCurrentFrequency = (activeFrequency, frequencies) => {
  if (activeFrequency === 'everything') {
    return;
  }
  return frequencies.filter(
    freq => freq.slug === activeFrequency || freq.id === activeFrequency,
  );
};
