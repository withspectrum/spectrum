import React from 'react';

class Suggestions extends React.Component {
  state = {
    suggestions: [],
  };

  render() {
    const { suggestions, selected } = this.props;
    if (suggestions === null) return <div>Loading...</div>;

    return (
      <div>
        {suggestions.map((text, index) => (
          <button
            key={text}
            onClick={() => this.props.select(text)}
            style={{
              background: index === selected ? 'red' : 'grey',
            }}
          >
            {text}
          </button>
        ))}
      </div>
    );
  }
}

export default Suggestions;
