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

export const getFrequencyPermission = (user, activeFrequency, frequencies) => {
  console.log('we are getting the frequency permission for this user')
  if (!user.uid) { return }
  console.log('we have a user and can proceed')
  const uid = user.uid
  console.log('use user is ', user, uid)
  if (activeFrequency !== "all") { // we wont' even show this if you're viewing all, so skip
    const frequencyToEval = frequencies.filter((freq) => {
      return freq.id === activeFrequency
    })

    console.log('we have pulled out the freq: ', frequencyToEval[0])
    console.log('with the users: ', frequencyToEval[0].users)
    let frequencyUsers = frequencyToEval[0].users
    if (frequencyUsers[uid]) { // make sure this user is viewing a frequency they have joined
      console.log('the user is a member of this frequency')
      const usersPerm = frequencyUsers[uid].permission
      console.log('and they have a permission of ', usersPerm)
      return usersPerm
    } else {
      return // the user isn't even part of the frequency
    }
  } else {
    return
  }
}

export const getCurrentFrequency = (activeFrequency, frequencies) => {
  if (activeFrequency === "all") { return }
  const obj = frequencies.filter((freq) => {
    return freq.id === activeFrequency
  })
  return obj[0]
}

export default {
  getMyFrequencies,
  getPublicFrequencies,
  getFrequencyPermission,
  getCurrentFrequency
}
