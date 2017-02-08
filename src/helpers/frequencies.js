export const getMyFrequencies = (frequencies, user) => {
	if (!user.uid) { return [] }

  let keys = Object.keys(user.frequencies)
	
	let myFrequencies = []
  for (let i = 0; i < frequencies.length; i++) {
    if (keys.indexOf(frequencies[i].id) > -1) {
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

  let keys = Object.keys(user.frequencies)
	
	let publicFrequencies = []
  for (let i = 0; i < frequencies.length; i++) {
    if (keys.indexOf(frequencies[i].id) !== -1) {
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

  return publicFrequencies
}

export const isCurrentFrequencyOwner = (frequency, user) => {
  if (!user.uid) { return }

  let keys = Object.keys(user.frequencies)

  if (keys.indexOf(frequency) > -1) {
    return true
  } else {
    return false
  }
}

export default {
  getMyFrequencies,
  getPublicFrequencies,
  isCurrentFrequencyOwner
}
