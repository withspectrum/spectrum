import React, { Component } from 'react';
import NavMaster from './components/NavMaster';
import { Body } from './style';
import StoryMaster from './components/StoryMaster';
import DetailView from './components/DetailView';
import LoadingIndicator from '../shared/loading';
import ModalRoot from '../shared/modals/ModalRoot';
import GalleryRoot from '../shared/gallery/GalleryRoot';

class App extends Component {
  render() {
    return (
      <Body>
        <ModalRoot />
        <GalleryRoot />
        <LoadingIndicator />
        <NavMaster />
        <StoryMaster />
        <DetailView />
      </Body>
    );
  }
}

export default App;
