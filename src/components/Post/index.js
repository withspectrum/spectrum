import React, { Component } from 'react';
import posts from '../../data/posts.js';
import { PostWrapper } from './style';
import UserHeader from '../UserHeader'

class Post extends Component{
	render() {
		return (
	    	<PostWrapper>
	    		<UserHeader />
	    		<div>
	    			<p className="mt2 h5 color-primary">{posts[0].post.body.text}</p>
	    			<img src="/img/media.png" className="mt2 flex-auto rounded" width="384px" role="presentation"/>
	    		</div>
    		</PostWrapper>
	  );
	}
}

export default Post;