import React, { Component } from 'react';
import posts from '../../data/posts.js';
import { PostWrapper } from './style';

class Post extends Component{
	render() {
		return (
	    	<PostWrapper>
	    		<div className="flex items-center">
	    			<img src="/img/avatar-spectrum.png" className="y4 x4 rounded bg-reverse inline-block" role="presentation"/>
	    			<div className="inline-block ml1 flex flex-column">
	    				<h3 className="h6 medium color-secondary self-start">{posts[0].post.user}</h3>
	    				<h4 className="h6 color-tertiary self-end">Oct 8, 2016 <span>• Pinned</span></h4>
	    			</div>
	    		</div>
	    		<div>
	    			<p className="mt2 h5 color-primary">{posts[0].post.body.text}</p>
	    			<img src="/img/media.png" className="mt2 flex-auto rounded" width="384px" role="presentation"/>
	    		</div>
    		</PostWrapper>
	  );
	}
}

export default Post;