import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../../actions'
import { getMyFrequencies } from '../../../helpers/frequencies'
import { ComposerContainer, Input, Submit, Textarea, Media, MediaInput, MediaLabel, MediaWrapper, Alert } from './style'

class Composer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      media: null,
      error: null,
      file: '',
      frequencyPicker: props.user.frequencies ? props.user.frequencies[0] : '' // by default the user's first frequency is selected in the frequency picker
    }
  }

  changeTitle = (e) => {
    this.setState({
      title: e.target.value,
      error: null
    });
  }

  changeDescription = (e) => {
    this.setState({
      description: e.target.value,
      error: null
    });
  }

  selectFrequencyFromDropdown = (e) => {
    this.setState({
      frequencyPicker: e.target.value
    })
  }

	createStory = (e) => {
    e.preventDefault();
    let description = this.state.description
    let title = this.state.title
    let file = this.state.file
    // if we pass in a custom frequency, it means the user is in 'all' and has selected a frequency from the dropdown
    // if the user isn't in all, we'll send the currently active frequency via the redux state
    let frequency = this.props.frequencies.active === "all" ? this.state.frequencyPicker : this.props.frequencies.active

    if (frequency && title && description) {      
	    this.props.dispatch(actions.createStory(frequency, title, description, file))
	    this.setState({
	      title: '',
	      description: '',
	      media: '',
	      file: ''
	    })
	  } else if (!title || !description) {
	  	this.setState({
	  		error: "Be sure to add a title and description!"
	  	})
	  } else {
      this.setState({
        error: "Be sure to pick a frequency to share this story to!"
      })
    }
  }

  removeMedia = () => {
  	this.setState({
  		media: null
  	})
  }

  uploadMediaLocally = (e) => {
  	let input = e.target;
    let reader = new FileReader();
    let file = e.target.files[0]
    reader.onload = () => {
      let dataURL = reader.result;
      this.setState({
	  		media: dataURL,
	  		file: file
	  	})
    };

    reader.readAsDataURL(input.files[0]);
  }

	render() {
    const frequencies = this.props.frequencies.frequencies
    const activeFrequency = this.props.frequencies.active
    const user = this.props.user
    const myFrequencies = getMyFrequencies(frequencies, user)

		return (
			<ComposerContainer isOpen={this.props.isOpen}>
				{ activeFrequency && 
	        <form onSubmit={ this.createStory } encType="multipart/form-data">

            { activeFrequency === "all" && myFrequencies.length > 0
              ? <select onChange={this.selectFrequencyFromDropdown} defaultValue={myFrequencies[0].id}>
                { 
                  myFrequencies.map((frequency, i) => {
                    return <option key={i} value={frequency.id}>{frequency.name}</option>
                  })
                }
              </select>
              : ''
            }

	          <Input placeholder="Title..." value={this.state.title} onChange={this.changeTitle} />
	          <Textarea placeholder="Description..." value={this.state.description} onChange={this.changeDescription}></Textarea>
	          
	          { this.state.media && 
	          	<MediaWrapper>
		          	<Media src={this.state.media} onClick={this.removeMedia} /> 
		          </MediaWrapper>
	          }

	          { !this.state.media &&
	          	<div>
		          	<MediaInput ref="media" type="file" id="file" name="file" accept=".png, .jpg, .jpeg, .gif" onChange={this.uploadMediaLocally} />
								<MediaLabel htmlFor="file">Add Image</MediaLabel>
							</div>
						}

	          <Submit type="submit"/>

	          { this.state.error &&
	          	<Alert>{this.state.error}</Alert>
	          }
	        </form>     
	      }
	    </ComposerContainer>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(Composer);