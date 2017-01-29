import * as firebase from 'firebase'

export const setFrequencies = () => (dispatch) => {
	let frequenciesRef = firebase.database().ref('frequencies');

	// once we get our frequencies, dispatch them to the store
  frequenciesRef.on('value', function(snapshot){
    dispatch({
	  	type: 'SET_FREQUENCIES',
	  	frequencies: snapshot.val()
	  })
  })
}

export const addFrequency = (name) => (dispatch, getState) => {
	const database = firebase.database()

	// generate a new entry in the frequencies collection with a key id
	const newFrequencyRef = database.ref().child(`frequencies`).push();
	const newFrequencyKey = newFrequencyRef.key

	// define data we'll want to update on the db
	const uid = getState().user.uid
	const timestamp = Math.round(new Date() / 1);
	let users = [] // a new frequency will have an array of users that join it
	users.push({ // the person doing the creation should be the first user
		uid: uid,
		permission: "owner" // if the person is creating the frequency, they are the owner
	})
	
	// create the data we want updated
	let updatedData = {}
	// let newFrequencyObject = {}
	// newFrequencyObject[newFrequencyKey] = true
	// updatedData[`users/${uid}/frequencies`] = newFrequencyObject // add the frequency id to the user object
	updatedData["frequencies/" + newFrequencyKey] = { // add the new frequency
		users: users,
    id: newFrequencyKey,
    createdAt: timestamp,
    createdBy: uid,
    name: name,
    settings: {
	    private: false, // frequencies are public by default
	    icon: null,
	    tint: "#3818E5",
	  },
	}

	function setFrequencies() {
		database.ref(`/users/${uid}/frequencies`).once('value').then(function(snapshot) { // we need to see what frequencies the user has already
		  let existingFrequencies = snapshot.val(); // this is a users existing frequencies

		  let newFrequencies, updatedFrequencies
		  if (existingFrequencies !== null) {
		  	// the user already has some frequencies
		  	updatedFrequencies = existingFrequencies // this is an array
		  	updatedFrequencies.push(newFrequencyKey) // add the new frequency to the array
		  } else {
		  	// the user has no frequencies at all, this is their first
		  	newFrequencies = [] // create an empty array
		  	newFrequencies.push(newFrequencyKey) // and push the new frequency
		  }

		  updatedData[`users/${uid}/frequencies`] = newFrequencies || updatedFrequencies // add the frequency id to the user object

		  database.ref().update(updatedData, function(error) {
			  if (error) {
			    console.log("Error updating data:", error);
			  }
			});

			dispatch({
				type: 'SET_ACTIVE_FREQUENCY',
				id: newFrequencyKey
			})
		});
	}

	setFrequencies()
}

export const setActiveFrequency = (id) => (dispatch) => {
	dispatch({
		type: 'SET_ACTIVE_FREQUENCY',
		id: id
	})
}