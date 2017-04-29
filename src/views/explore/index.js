// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
// import withProps from 'recompose/withProps';
// import Loading from '../../components/loading';
//
// import { getFrequency } from './queries';
//
// import { FlexCol } from '../../components/globals';
// import Icon from '../../components/icons';
// // import { getFrequency, getFeaturedFrequencies } from '../../../db/frequencies';
// // import {
// //   unsubscribeFrequency,
// //   subscribeFrequency,
// // } from '../../../actions/frequencies';
// // import { GoopyThree } from '../homepage/style';
// import {
//   ViewContainer,
//   ViewTitle,
//   ViewSubtitle,
//   Section,
//   SectionTitle,
//   SectionSubtitle,
//   Row,
//   Item,
//   ItemTitle,
//   ItemCopy,
//   ItemMeta,
//   ItemButton,
//   ButtonContainer,
//   ScrollBody,
//   ViewHeader,
//   Constellations,
// } from './style';
//
// const CURATED_FREQUENCIES = [
//   { id: '0304595c-afbe-4b7c-8335-082971838097' },
//   { id: '06c877e9-b872-42ef-9416-aa1d465888df' },
//   { id: '0352f4f5-8e12-4de8-8299-9a6664f77ee0' },
//   { id: '16bf0f80-0335-4fbb-8d4d-ccfe5c8c8162' },
//   { id: '03426243-2c9c-4f99-bc77-867e37f8e4e3' },
// ];
//
// const Frequency = (data) => {
//   console.log(data)
//   return (
//     <div>fuck</div>
//   )
// }
//
// const ExplorePure = () => {
//
// return (
//   <div>
//     return CURATED_FREQUENCIES.map(freq => {
//       const id = freq.id
//       console.log(id)
//       const enhance = compose(withProps({ id }), getFrequency);
//       const FrequencyWithData = enhance(Frequency);
//       return (
//         FrequencyWithData
//       )
//     })
//   </div>
// )
// };
//
// export default ExplorePure;

import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import withProps from 'recompose/withProps';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Loading from '../../components/loading';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { getFrequency } from './queries';

const CURATED_FREQUENCIES = [
  { id: '0304595c-afbe-4b7c-8335-082971838097' },
  { id: '06c877e9-b872-42ef-9416-aa1d465888df' },
  { id: '0352f4f5-8e12-4de8-8299-9a6664f77ee0' },
  { id: '16bf0f80-0335-4fbb-8d4d-ccfe5c8c8162' },
  { id: '03426243-2c9c-4f99-bc77-867e37f8e4e3' },
];

const Frequency = ({ data }) => {
  console.log(data);
  return <div>{data.frequency.name}</div>;
};

const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

const ExplorePure = ({ match }) => {
  return (
    <AppViewWrapper>
      <Column type="primary" alignItems="center">
        {CURATED_FREQUENCIES.map(frequency => {
          const enhance = compose(
            withProps({ id: frequency.id }),
            getFrequency,
            displayLoadingState
          );

          const FrequencyWithData = enhance(Frequency);

          return (
            <div key={frequency.id}>
              k
              {FrequencyWithData()}
            </div>
          );
        })}
      </Column>
    </AppViewWrapper>
  );
};

export const Explore = pure(ExplorePure);
export default Explore;

// class Explore extends Component {
//   render() {
//
//
//
//     return (
//       <ViewContainer>
//         <ScrollBody>
//           <ViewHeader>
//             <ViewTitle>Explore</ViewTitle>
//             <ViewSubtitle>
//               Discover more of what Spectrum has to offer!
//             </ViewSubtitle>
//           </ViewHeader>
//
//           {
//             CURATED_FREQUENCIES.map(frequency => {
//               console.log(frequency.id)
//               const id = frequency.id
//               return compose(getFrequency)(Frequency);
//
//               // return enhance(Frequency)
//             })
//           }
//
//           <Section>
//             <SectionTitle>
//               Best of beta
//             </SectionTitle>
//             <SectionSubtitle>
//               The 30 most-popular pre-launch frequencies
//             </SectionSubtitle>
//             <Row />
//           </Section>
//           <Section>
//             <SectionTitle>
//               5 cool ways to use frequencies
//             </SectionTitle>
//             <SectionSubtitle>
//               News, journaling, communities, show and tell, and recommendations...
//             </SectionSubtitle>
//             <Row />
//           </Section>
//           <Section>
//             <SectionTitle>
//               For developers
//             </SectionTitle>
//             <SectionSubtitle>
//               Programming languages, hot frameworks, podcasts, blogs, and more...
//             </SectionSubtitle>
//             <Row />
//           </Section>
//           <Section>
//             <SectionTitle>
//               For designers
//             </SectionTitle>
//             <SectionSubtitle>
//               Resources, inspiration, critique, podcasts, and more...
//             </SectionSubtitle>
//             <Row />
//           </Section>
//           <Section>
//             <SectionTitle>
//               Just for funsies
//             </SectionTitle>
//             <SectionSubtitle>
//               Bond with the community over our favorite things to do after hours!
//             </SectionSubtitle>
//             <Row />
//           </Section>
//           <Section>
//             <SectionTitle>
//               Need help?
//             </SectionTitle>
//             <SectionSubtitle>
//               We've got your back in our support frequencies...
//             </SectionSubtitle>
//             <Row />
//           </Section>
//         </ScrollBody>
//       </ViewContainer>
//     );
//   }
// }
