import * as firebase from 'firebase'

export const hashToArray = (hash) => {
  let array = []
  for (let key in hash) {
    if (!hash.hasOwnProperty(key)) continue;
    let arr = hash[key];
    array.push(arr)
  }
  return array
}

export const sortAndGroupBubbles = (messages) => {
	let masterArray = []
	let newArray = []
	if (messages.length > 0) {
		let checkId
		
		for (let i = 0; i < messages.length; i++){
			if (i === 0) { checkId = messages[i].userId }

			if (messages[i].userId === checkId) {
				// this message user id does match
				newArray.push(messages[i])
				checkId = messages[i].userId
			} 
			else {
				// this message user id doesn't match
				masterArray.push(newArray)

				// reset
				checkId = messages[i].userId
				newArray = []
				newArray.push(messages[i])
			}


		}
	}
	masterArray.push(newArray)
	return masterArray
}


const fetch = (ref, orderBy, equalTo) => {
	if (ref === 'stories') {
		return new Promise((resolve, reject) => {

			return firebase.database().ref(ref).orderByChild(orderBy).equalTo(equalTo).on('value', (snapshot) => {
				let val = snapshot.val()
		    resolve(val)
			})

		})
	}

	if (ref === 'frequencies') {
		return new Promise((resolve, reject) => {

			return firebase.database().ref(ref).orderByChild(orderBy).equalTo(equalTo).on('value', (snapshot) => {
		  	let val = snapshot.val()
		  	let obj = val[equalTo]
		    resolve(obj)
		  })

		})
	}
}

const fetchDataByIds = (obj, params) => {
	// console.log('obj params: ', obj, params)
  let keys = Object.keys(obj)
  return Promise.all(keys.map(key => fetch(...params, key)))
}

export const fetchFrequenciesForUser = (frequencies) => {
	return fetchDataByIds(frequencies, ['frequencies', 'id'])
}

export const fetchStoriesForFrequencies = (frequencies) => {
	return fetchDataByIds(frequencies, ['stories', 'frequency'])
}

export default {
	hashToArray,
	sortAndGroupBubbles,
	fetchFrequenciesForUser,
	fetchStoriesForFrequencies
}
