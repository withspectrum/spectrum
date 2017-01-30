import * as firebase from 'firebase'
window.firebase = firebase;

export const setFrequencies = () => (dispatch) => {
  const database = firebase.database()
	let frequenciesRef = database.ref('frequencies');

	// once we get our frequencies, dispatch them to the store
  frequenciesRef.on('value', function(snapshot){
    dispatch({
	  	type: 'SET_FREQUENCIES',
	  	frequencies: snapshot.val()
	  })
  })
}

export const addFrequency = (name) => (dispatch, getState) => {

	// generate a new entry in the frequencies collection with a key id
  const database = firebase.database()
	const newFrequencyRef = database.ref().child(`frequencies`).push();
	const newFrequencyKey = newFrequencyRef.key

	// define data we'll want to update on the db
	const uid = getState().user.uid
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
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    createdBy: uid,
    name: name,
    settings: {
	    private: false, // frequencies are public by default
	    icon: null,
	    tint: "#3818E5",
	  },
	}	

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
