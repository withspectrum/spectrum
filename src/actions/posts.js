import * as firebase from 'firebase';

export const setPosts = () => (dispatch, getState) => {
	let posts = firebase.database().ref('posts')
  const activeFrequency = getState().frequencies.active

  posts.orderByChild('frequency').equalTo(activeFrequency).on('value', function(snapshot){
    dispatch({
	  	type: 'SET_POSTS',
	  	posts: snapshot.val()
	  })
  });
}

export const createPost = (content) => (dispatch, getState) => {
	const uid = getState().user.uid
  const activeFrequency = getState().frequencies.active
	const timestamp = Math.round(new Date() / 1);
	let newPostRef = firebase.database().ref().child(`posts`).push();
  let postData = {
    uid: uid,
    timestamp: timestamp,
    content: content,
    frequency: activeFrequency
  }
  newPostRef.set(postData, function(err){
  	console.log(err)
  });
}