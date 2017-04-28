import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlexCol } from '../../components/globals';
import Icon from '../../components/icons';
// import { getFrequency, getFeaturedFrequencies } from '../../../db/frequencies';
// import {
//   unsubscribeFrequency,
//   subscribeFrequency,
// } from '../../../actions/frequencies';
// import { GoopyThree } from '../homepage/style';
import {
  ViewContainer,
  ViewTitle,
  ViewSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  Row,
  Item,
  ItemTitle,
  ItemCopy,
  ItemMeta,
  ItemButton,
  ButtonContainer,
  ScrollBody,
  ViewHeader,
  Constellations,
} from './style';

const CURATED_FREQUENCIES = [
  { id: '0304595c-afbe-4b7c-8335-082971838097' },
  { id: '06c877e9-b872-42ef-9416-aa1d465888df' },
  { id: '0352f4f5-8e12-4de8-8299-9a6664f77ee0' },
  { id: '16bf0f80-0335-4fbb-8d4d-ccfe5c8c8162' },
  { id: '03426243-2c9c-4f99-bc77-867e37f8e4e3' },
];

class Explore extends Component {
  render() {
    return (
      <ViewContainer>
        <ScrollBody>
          <ViewHeader>
            <ViewTitle>Explore</ViewTitle>
            <ViewSubtitle>
              Discover more of what Spectrum has to offer!
            </ViewSubtitle>
          </ViewHeader>
          <Section>
            <SectionTitle>
              Best of beta
            </SectionTitle>
            <SectionSubtitle>
              The 30 most-popular pre-launch frequencies
            </SectionSubtitle>
            <Row />
          </Section>
          <Section>
            <SectionTitle>
              5 cool ways to use frequencies
            </SectionTitle>
            <SectionSubtitle>
              News, journaling, communities, show and tell, and recommendations...
            </SectionSubtitle>
            <Row />
          </Section>
          <Section>
            <SectionTitle>
              For developers
            </SectionTitle>
            <SectionSubtitle>
              Programming languages, hot frameworks, podcasts, blogs, and more...
            </SectionSubtitle>
            <Row />
          </Section>
          <Section>
            <SectionTitle>
              For designers
            </SectionTitle>
            <SectionSubtitle>
              Resources, inspiration, critique, podcasts, and more...
            </SectionSubtitle>
            <Row />
          </Section>
          <Section>
            <SectionTitle>
              Just for funsies
            </SectionTitle>
            <SectionSubtitle>
              Bond with the community over our favorite things to do after hours!
            </SectionSubtitle>
            <Row />
          </Section>
          <Section>
            <SectionTitle>
              Need help?
            </SectionTitle>
            <SectionSubtitle>
              We've got your back in our support frequencies...
            </SectionSubtitle>
            <Row />
          </Section>
        </ScrollBody>
      </ViewContainer>
    );
  }
}

export default Explore;
