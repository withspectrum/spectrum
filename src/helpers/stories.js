import findIndex from 'lodash.findindex'
import * as firebase from 'firebase';

export const isStoryCreator = (story, user) => {
  if (!user.uid) { return }

	let uid = user.uid
	let frequency = story.frequency
	let creator = story.creator.uid

  if (uid === creator) {
    return true
  } else {
    return false
  }
}

export const fetchStoriesForFrequencies = (frequencies) => {
  return Promise.all(frequencies.map(fetchStoriesForFrequency))
}

export const fetchStoriesForFrequency = (frequency) => {
  return firebase.database().ref('stories').orderByChild('frequency').equalTo(frequency).once('value').then(function(snapshot) {
    return snapshot.val();
  });
}

export const getStoryPermission = (story, user, frequencies) => {
  if (!user.uid) { return }
  
  let uid = user.uid
	let storyFrequency = story.frequency
	let creator = story.creator.uid
	let allFrequencies = frequencies.frequencies

	let freqIndex = findIndex(allFrequencies, (o) => { 
		return o.id === storyFrequency
	})
	
	freqIndex = allFrequencies[freqIndex]
	let freqUsers = freqIndex.users

	let userIndex = findIndex(freqUsers, (o) => {
		return o.uid = uid
	})

	let userPermissionsFromFreq = freqUsers[userIndex].permission

	return userPermissionsFromFreq
  
}
