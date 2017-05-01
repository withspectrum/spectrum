import React from 'react';

import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
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

// const ExploreListContainer = ({ data: { frequencies }}) => {
//   return (
//     frequencies.map(frequency => {
//       return <div>{frequency.name}</div>
//     })
//   )
// }
//
// const enhance = compose(getTopThirtyFrequencies, displayLoadingState)
// const ExploreListContainerWithData = enhance(ExploreListContainer)

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

          return <div key={frequency.id}>{FrequencyWithData()}</div>;
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
