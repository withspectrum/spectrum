import React, { Component } from 'react';

class TagButton extends Component{
	render() {
		return (
      <div className="flex flex-column" onClick={this.props.clickHandler}>
        {this.props.name}
      </div>
	  );
	}
}

export default TagButton;
