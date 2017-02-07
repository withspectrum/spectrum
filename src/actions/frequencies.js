import * as firebase from 'firebase'
import { hashToArray } from '../helpers/utils'

export const setFrequencies = () => (dispatch) => {
  const database = firebase.database()
  let frequenciesRef = database.ref('frequencies');

  // once we get our frequencies, dispatch them to the store
  frequenciesRef.on('value', function(snapshot){
  	const frequencies = hashToArray(snapshot.val())
    dispatch({
	  	type: 'SET_FREQUENCIES',
	  	frequencies: frequencies
	  })
  })
}

export const addFrequency = (name) => (dispatch, getState) => {
	// generate a new entry in the frequencies collection with a key id
	const database = firebase.database()
	const newFrequencyRef = database.ref().child("frequencies").push();
	const newFrequencyKey = newFrequencyRef.key

	// define data we'll want to update on the db
	const uid = getState().user.uid
	let user = { // the person doing the creation should be the first user
    permission: "owner" // if the person is creating the frequency, they are the owner
	}

	// create the data we want updated
	let updatedData = {}
	let newFrequencyData = { // add the new frequency
	  users: {
      [uid]: user
    },
	  id: newFrequencyKey,
	  createdAt: firebase.database.ServerValue.TIMESTAMP,
	  createdBy: uid,
	  name: name,
	  settings: {
	    private: false, // frequencies are public by default
	    icon: null,
	    tint: "#3818E5",
	  },
	}

	updatedData["frequencies/" + newFrequencyKey] = newFrequencyData;

	saveFrequencies()

	function saveFrequencies() {
	  // we need to see what frequencies the user has already:
	  database.ref(`/users/${uid}/frequencies`).once('value').then(function(snapshot) {

	    let updatedFrequencies = snapshot.val() || [];
	    updatedFrequencies.push(newFrequencyKey) // and push the new frequency
	    updatedData[`users/${uid}/frequencies`] = updatedFrequencies // add the frequency id to the user object

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
}

export const setActiveFrequency = (id) => (dispatch) => {
    dispatch({
        type: 'SET_ACTIVE_FREQUENCY',
        id: id
    })
}

export const subscribeFrequency = () => (dispatch, getState) => {
	const database = firebase.database()
	const state = getState()
	const uid = state.user.uid
	let usersFrequencies = state.user.frequencies || []
	let activeFrequency = state.frequencies.active
	usersFrequencies[activeFrequency] = {id: activeFrequency}

	database.ref(`/users/${uid}`).update({
		frequencies: usersFrequencies
	})
  database.ref(`/frequencies/${activeFrequency}`).once('value').then(function(snapshot){
    let users = snapshot.val().users
    let user = {
	    permission: "subscriber"
    }
    users.push(user)
    database.ref(`/frequences/${activeFrequency}/users/${uid}`).update(user)
  })

}

export const unsubscribeFrequency = () => (dispatch, getState) => {
	const database = firebase.database()
	const state = getState()
	const uid = state.user.uid	
	let usersFrequencies = state.user.frequencies
	let activeFrequency = state.frequencies.active
	delete usersFrequencies[activeFrequency]

	database.ref(`/users/${uid}`).update({
		frequencies: usersFrequencies
	})
}
