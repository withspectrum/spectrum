import React, { Component } from 'react';
import posts from '../../data/posts.js';
import { PostWrapper, PostBody, PostImg } from './style';
import UserHeader from '../UserHeader'

class Post extends Component{
	render() {
		return (
	    	<PostWrapper>
	    		<UserHeader />
	    		<PostBody>
	    			<p className="mt2 h5 color-primary">{posts[0].post.body.text}</p>
	    			<PostImg src="/img/media.png" role="presentation"/>
	    		</PostBody>
    		</PostWrapper>
	  );
	}
}

export default Post;