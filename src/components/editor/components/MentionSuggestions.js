import React from 'react';

class Suggestions extends React.Component {
  state = {
    suggestions: [],
  };

  select = () => {
    this.props.select(this.props.mention);
  };

  render() {
    return (
      <div>
        <button onClick={this.select}>{this.props.mention}</button>
      </div>
    );
  }
}

export default Suggestions;
