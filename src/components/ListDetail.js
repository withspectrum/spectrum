import React, { Component } from 'react';

class ListDetail extends Component{
	render() {
		return (
      <div className="flex-auto flex">
        {this.props.children}
      </div>
	  );
	}
}

export default ListDetail;
