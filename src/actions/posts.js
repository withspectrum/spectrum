import * as firebase from 'firebase';

export const setPosts = (data) => (dispatch) => {
	let posts = firebase.database().ref('posts')
	// once there are posts, set them to the state
	posts.on('value', function(snapshot){
    dispatch({
	  	type: 'SET_POSTS',
	  	posts: snapshot.val()
	  })
  });
}

export const createPost = (content) => (dispatch, getState) => {
	const uid = getState().user.uid
	const timestamp = Math.round(new Date() / 1);
	let newPostRef = firebase.database().ref().child(`posts`).push();
  let postData = {
    uid: uid,
    timestamp: timestamp,
    content: content
  }
  newPostRef.set(postData, function(err){
  	console.log(err)
  });
}