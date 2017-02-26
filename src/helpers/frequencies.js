export const getCurrentFrequency = (activeFrequency, frequencies) => {
  if (activeFrequency === 'everything') {
    return;
  }
  console.log('active: ', activeFrequency, ' frequencies: ' , frequencies)
  return frequencies.find(
    freq => freq.slug === activeFrequency || freq.id === activeFrequency,
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
