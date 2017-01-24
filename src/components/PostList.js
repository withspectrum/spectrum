import React, { Component } from 'react';
import Post from './Post';
import * as firebase from 'firebase';

class PostList extends Component{
  constructor(props){
    super(props);
    this.state = {
      newPostContent: "",
      posts: [

      ]
    }
  }
  componentDidMount(){
    let postRef = firebase.database().ref('posts');
    postRef.on('value', function(snapshot){
      console.log(snapshot.val());
    });
  }
  containerClassName(){
    return {
      true: "col-12",
      false: "col-8"
    }[this.props.currentData.currentPost.id === undefined]
  }
  changeNewPostContent(e){
    this.setState({
      newPostContent: e.target.value
    });
  }
  postForm(){
    if (this.props.currentData.currentUser !== undefined){
      return(
        <form onSubmit={this.createPost.bind(this)}>
          <input value={this.state.newPostContent} onChange={this.changeNewPostContent.bind(this)} />
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
    let newPostRef = firebase.database().ref().child(`posts/${this.props.activeTag}`).push();
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
	    	<div className={`flex-auto flex flex-column hairline-right ${this.containerClassName()}`}>
	    		<div className="bg-default y6 hairline-bottom flex-none"></div>
          { that.postForm() }
	    		<Post />
	    	</div>
	  );
	}
}

export default PostList;
