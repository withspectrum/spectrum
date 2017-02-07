import * as firebase from 'firebase';

export const isStoryCreator = (story, user) => {
  if (!user.uid) { return }

	let uid = user.uid
	let creator = story.creator.uid

  if (uid === creator) {
    return true
  } else {
    return false
  }
}

export const fetchStoriesForFrequency = (frequency) => {
  return firebase.database().ref('stories').orderByChild('frequency').equalTo(frequency).once('value').then(function(snapshot) {
    return snapshot.val();
  });
}

export const fetchStoriesForFrequencies = (frequencies) => {
  let keys = Object.keys(frequencies)
  return Promise.all(keys.map(fetchStoriesForFrequency))
}

export const getStoryPermission = (story, user, frequencies) => {
  if (!user.uid) { return }
  
  let uid = user.uid
	let storyFrequencyId = story.frequency
	let frequencyMatch = frequencies.frequencies.filter((freq) => {
		return freq.id === storyFrequencyId
  })

	let storyFrequency = frequencyMatch[0]
  let permission = storyFrequency.length ? storyFrequency.users[uid].permission : "subscriber"

	return permission
  
}
