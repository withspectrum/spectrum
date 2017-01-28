import React, { Component } from 'react';

class ListDetail extends Component{
	render() {
		return (
      <div>
        {this.props.children}
      </div>
	  );
	}
}

export default ListDetail;
