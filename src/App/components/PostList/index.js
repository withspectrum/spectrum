import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getPosts } from '../../../actions/posts'
import { Column, ActionHeader, ScrollBody } from './style';
import Post from '../Post';
import * as firebase from 'firebase';

class PostList extends Component{
  constructor(){
    super();
    this.state = {
      newPostContent: "",
      posts: []
    }
  }

  componentWillMount(){
    this.props.dispatch(getPosts())
  }

  changeNewPostContent = (e) => {
    this.setState({
      newPostContent: e.target.value
    });
  }

  createPost(e){
    e.preventDefault();
    // let database = firebase.database();
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

  renderPosts() {
    this.props.posts.map((post, i) => {
      return <Post data={post} />
    })
  }

	render() {

    /**
      Firebase returns posts as a bunch of nested objects. In order to have better control over
      iterative rendering (i.e. using .map()) we need to get these posts into an array.
    */
    let posts = this.props.posts.posts
    let postsToRender = []
    for (let key in posts) {
      let arr = posts[key];
      postsToRender.push(arr)
    }

		return (
	    	<Column>
	    		<ActionHeader />
          { this.props.user &&
            <form onSubmit={this.createPost}>
              <input value={this.state.newPostContent} onChange={this.changeNewPostContent} />
              <input type="submit" />
            </form>
          }
          <ScrollBody>
            { postsToRender.length > 0 &&
              postsToRender.map((post, i) => {
                return <Post data={post} key={i} />
              }) 
            }
          </ScrollBody>
	    	</Column>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    posts: state.posts
  }
}

export default connect(mapStateToProps)(PostList)