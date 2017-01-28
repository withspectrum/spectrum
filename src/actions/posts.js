import * as firebase from 'firebase';

export const getPosts = (data) => (dispatch) => {
	let posts = firebase.database().ref('posts')
	// once there are posts, set them to the state
	posts.on('value', function(snapshot){
    dispatch({
	  	type: 'SET_POSTS',
	  	posts: snapshot.val()
	  })
  });
}