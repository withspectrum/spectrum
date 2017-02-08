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
  
  if (story) { // make sure we're evaluating a story
    let uid = user.uid
  	let storyFrequencyId = story.frequency // get the frequency the story was posted in
  	let frequencyMatch = frequencies.frequencies.filter((freq) => { // and filter that against all the stories returned
  		return freq.id === storyFrequencyId // when we have a match, return the frequency object
    })

    if (frequencyMatch.length > 0) {
    	let storyFrequency = frequencyMatch[0]

      let permission = frequencies.frequencies.length && storyFrequency.users[uid] ? storyFrequency.users[uid].permission : "subscriber"

    	return permission
    } else {
      return
    }
  } else {
    return
  }
}

export default {
  isStoryCreator,
  fetchStoriesForFrequency,
  fetchStoriesForFrequencies,
  getStoryPermission
}
