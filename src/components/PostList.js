import React, { Component } from 'react';
import Post from './Post';

class PostList extends Component{
	render() {
		return (
	    	<div className="flex-auto flex flex-column hairline-right lg-col-3 col-5">
	    		<div className="bg-default y6 hairline-bottom flex-none"></div>
	    		<Post />
	    	</div>
	  );
	}
}

export default PostList;