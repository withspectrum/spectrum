import React, { Component } from 'react';

class SideBar extends Component{
	render() {
		return (
	    	<div className="flex-auto flex flex-column col-1 min-x8 bg-primary">
	    		<div className="flex y10 justify-center items-center">
		    		<img src="/img/logo-mark.png" className="x3 y3" role="presentation"/>
	    		</div>
	    	</div>
	  );
	}
}

export default SideBar;