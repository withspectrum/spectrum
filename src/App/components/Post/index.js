import React, { Component } from 'react';
import { PostWrapper, PostBody } from './style';
import UserHeader from '../UserHeader'

class Post extends Component{
	render() {
		return (
	    	<PostWrapper>
	    		<UserHeader />
	    		<PostBody>
	    			<p>{this.props.data.content}</p>
	    			{/*<p className="mt2 h5 color-primary"></p>
	    			<PostImg src="/img/media.png" role="presentation"/> */}
	    		</PostBody>
    		</PostWrapper>
	  );
	}
}

export default Post;