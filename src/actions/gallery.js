import * as firebase from 'firebase';
import helpers from '../helpers';

/*------------------------------------------------------------\*
*

Gallery
Accepts an array of URLs which will be parsed and populated in the gallery component.

*
\*------------------------------------------------------------*/
export const showGallery = (e) => (dispatch, getState) => {
  let state = getState()
  let src = e.target.src
  let activeStory = state.stories.active

  let storyRef = firebase.database().ref(`stories/${activeStory}/media`).on('value', (snapshot) => {
  	let val = snapshot.val()
  	let arr = helpers.hashToArray(val)
  	let urlArr = arr.slice().map((img, i) => img.fileName)//=> convert hash to array of filename urls

  	let checkForMatch = urlArr.filter((url) => {
  		let long = src.toString()
  		let match = url.toString()
  		let re = new RegExp(match, 'g')
  		let itMatches = long.match(re)
  		return itMatches
  	})

  	let matchToIndex = checkForMatch[0]
  	let index = urlArr.indexOf(matchToIndex)

  	getStorageUrlsFromArr(urlArr, activeStory)
  	.then((arr) => {
  		dispatch({
  			type: 'SHOW_GALLERY',
  			isOpen: true,
  			media: arr,
  			index: index ? index : 0 // i
  		})
  	})
  })
};

export const getFile = (file, story) => {
	return new Promise((resolve, reject) => {
		if (!file) return

		let storageRef = firebase.storage().ref()
		let fileRef = storageRef.child(`${story}/${file}`)
		let url = fileRef.getDownloadURL().then((url) => {
			resolve(url)
		})
	})
}

export const getStorageUrlsFromArr = (arr, story) => {
	return Promise.all(arr.map((file) => getFile(file, story)))
}

export const hideGallery = () => ({
  type: 'HIDE_GALLERY',
});

export default {
  showGallery,
  hideGallery,
};
