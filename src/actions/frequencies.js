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
	const uid = getState().user.uid
	const timestamp = Math.round(new Date() / 1);
	let newFrequencyRef = firebase.database().ref().child(`frequencies`).push();
	let users = []
	users.push({
		uid: uid,
		permission: "owner" // if the person is creating the frequency, they are the owner
	})

  let data = {
    users: users,
    created: timestamp,
    name: name,
    private: false, // frequencies are public by default
    icon: null
  }
  
  newFrequencyRef.set(data, function(err){
  	console.log(err)
  });
}