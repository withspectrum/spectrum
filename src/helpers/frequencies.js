export const getMyFrequencies = (frequencies, user) => {
	if (!user.uid) { return [] }
	
	let myFrequencies = []
  for (let i = 0; i < frequencies.length; i++) {
    if (user.frequencies.indexOf(frequencies[i].id) > -1) {
      myFrequencies.push(
        {
          id: frequencies[i].id,
          name: frequencies[i].name,
          settings: frequencies[i].settings,
          users: frequencies[i].users,
          createdAt: frequencies[i].createdAt,
          createdBy: frequencies[i].createdBy
        }
      )
    }
  }
	return myFrequencies
}

export const getPublicFrequencies = (frequencies, user) => {
	if (!user.uid) { return }
	
	let publicFrequencies = []
  for (let i = 0; i < frequencies.length; i++) {
    if (user.frequencies.indexOf(frequencies[i].id) !== -1) {
    	// do nothing
    } else {
      publicFrequencies.push(
        {
          id: frequencies[i].id,
          name: frequencies[i].name,
          settings: frequencies[i].settings,
          users: frequencies[i].users,
          createdAt: frequencies[i].createdAt,
          createdBy: frequencies[i].createdBy
        }
      )
    }
  }
}

export const isCurrentFrequencyOwner = (frequency, user) => {
  if (!user.uid) { return }

  if (user.frequencies.indexOf(frequency) > -1) {
    return true
  } else {
    return false
  }
}
