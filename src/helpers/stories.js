import { findIndex } from 'lodash'

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

export const isStoryModerator = (story, user, frequencies) => {
  if (!user.uid) { return }
  
  let uid = user.uid
	let storyFrequency = story.frequency
	let creator = story.creator.uid
	let allFrequencies = frequencies.frequencies

	const freqIndex = _.findIndex(allFrequencies, function(o) { return o.id === storyFrequency})
	
	console.log(freqIndex)
  
}