import React, { Component } from 'react';
import { Column, ActionHeader, ScrollBody } from './style';
import Post from '../Post';
import * as firebase from 'firebase';

export default class PostList extends Component{
  constructor(){
    super();
    this.state = {
      newPostContent: "",
      posts: []
    }
  }
  componentDidMount(){
    let postRef = firebase.database().ref('posts');
    postRef.on('value', function(snapshot){
      console.log(snapshot.val());
    });
  }

  changeNewPostContent = (e) => {
    this.setState({
      newPostContent: e.target.value
    });
  }

  postForm(){
    if (this.props.currentData.currentUser !== undefined){
      return(
        <form onSubmit={this.createPost}>
          <input value={this.state.newPostContent} onChange={this.changeNewPostContent} />
          <input type="submit" />
        </form>
      );
    }
  }

  createPost(e){
    e.preventDefault();
    let database = firebase.database();
    let userId = firebase.auth().currentUser.uid;
    let timestamp = Math.round(new Date() / 1);
    let newPostRef = firebase.database().ref().child(`posts/${this.props.currentTag}`).push();
    let postData = {
      uid: userId,
      timestamp: timestamp,
      content: this.state.newPostContent
    }
    newPostRef.set(postData);
  }

	render() {
    let that = this;
		return (
	    	<Column>
	    		<ActionHeader />
          {/* that.postForm() */}
          <ScrollBody>
  	    		<Post />
            <Post />
            <Post />
            <Post />
          </ScrollBody>
	    	</Column>
	  );
	}
}
