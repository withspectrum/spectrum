import * as firebase from 'firebase'
import axios from 'axios'

export const login = () => (dispatch) => {
  let provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var user = result.user;
    
    // our user is created and authenticated, now lets save them to the db
    const uid = user.uid
    let newUserRef = firebase.database().ref().child(`users/${uid}`)

    newUserRef.once('value', function(snapshot) { // take a look at the ref via a snapshot
      var exists = (snapshot.val() !== null) // if the snapshot doesn't exist, it means we haven't created this user in the db yet
      if (!exists) { // if the user doesn't exist
        let userData = { // set the user's data
          uid: uid,
          created: firebase.database.ServerValue.TIMESTAMP,
          displayName: user.displayName,
          photoURL: user.photoURL,
          frequencies: {"-Kbmn0PG3Y9WcUEh-I7y": { id: "-Kbmn0PG3Y9WcUEh-I7y"}}
        }

        newUserRef.set(userData, function(err){ // and then write that data to the db
          console.log('error setting new user: ', err)
        });
      }
    })
    
    // ...
  }).catch(function(error) {
    console.log('login error: ', error);
  });
}

export const startListeningToAuth = () => (dispatch) => {
	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const database = firebase.database()
      let usersRef = database.ref('users');

      usersRef.orderByChild('uid').equalTo(user.uid).on('value', function(snapshot){
        let userObject = snapshot.val()
        userObject = userObject[user.uid] // get the first user returned, which should be the current user
        
        dispatch({
          type: 'SET_USER',
          user: userObject
        })
      });
    } else {
      // the person isn't a user
    }
  });
}

export const signOut = () => (dispatch) => {
  firebase.auth().signOut().then(function() {
    // sign out successful
    localStorage.removeItem('state') // clear the localstorage state
    window.location.href = '/' // refresh the page
  }, function(error) {
    console.log('signout error: ', error)
  })
}

export const upgradeUser = (subscription) => (dispatch, getState) => {
  const uid = getState().user.uid
  // console.log('subscription is: ', subscription)
  firebase.database().ref(`users/${uid}`).update({
    customerId: subscription.customer,
    email: subscription.email
  })
}

export const getUserSubscriptions = () => (dispatch, getState) => {
  const customerId = getState().user.customerId

  if (customerId) {
    axios.get('http://localhost:3001/customer', { params: { id: customerId }})
      .then((response) => {

        let subscriptionsData = response.data.subscriptions.data
        let subscriptions = []

        subscriptionsData.map((subscription) => {
          subscriptions.push({
            name: subscription.plan.name,
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            id: subscription.id
          })
        })

        dispatch({
          type: 'SET_SUBSCRIPTIONS',
          subscriptions: subscriptions
        })
      })
      .catch((error) => {
        return
      });
  } else {
    // if we can't find a customer id, it means the user triggered this somehow without being a paying customer
    return
  }
}

export default {
  login,
  startListeningToAuth,
  signOut,
  upgradeUser,
  getUserSubscriptions
}
