import React, { Component } from 'react';

export default class TagButton extends Component{
  getStyle(){
    return {
      color: "#FFF",
    }
  }
	render() {
		return (
      <div className={`flex flex-column`} style={this.getStyle()} data-current={this.props.current} onClick={this.props.clickHandler}>
        {this.props.name}
      </div>
	  );
	}
}
