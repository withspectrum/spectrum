// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { Easing, View, Animated } from 'react-native';
import CommunityUpsellCards from './CommunityUpsellCards';
import { Button } from '../../../components/Button';
import {
  ContinueButtonContainer,
  ExploreCommunitiesWrapper,
  ExploreSectionHeader,
  ExploreSectionSubheader,
} from './style';
import { ViewTitle, ViewSubtitle } from '../style';
import ExploreContext from './context';
import ExploreCommunitiesHeader from './ExploreCommunitiesHeader';
import ExploreSearchResults from './ExploreSearchResults';
import addCommunityMembersMutation from '../../../../shared/graphql/mutations/communityMember/addCommunityMembers';
import { events, track } from '../../../utils/analytics';

type State = {
  // context
  joinedCommunities: Array<?string>,
  onJoinCommunity: Function,
  onLeaveCommunity: Function,
  onSearchFocus: Function,
  onSearchBlur: Function,
  // local state
  queryString: ?string,
  isJoiningCommunities: boolean,
};

type Props = {
  addCommunityMembers: Function,
  refetch: Function,
};

const continueButtonHiddenY = 85;
const continueButtonVisibleY = 0;

class ExploreCommunities extends React.Component<Props, State> {
  scrollView: any;

  opacityValue = new Animated.Value(1);
  continueButtonY = new Animated.Value(continueButtonHiddenY);
  continueButtonOpacity = new Animated.Value(0);

  constructor() {
    super();
    this.state = {
      joinedCommunities: [],
      onJoinCommunity: this.onJoinCommunity,
      onLeaveCommunity: this.onLeaveCommunity,
      onSearchFocus: this.onSearchFocus,
      onSearchBlur: this.onSearchBlur,
      onSearch: this.onSearch,
      //
      queryString: '',
      isJoiningCommunities: false,
    };
  }

  componentDidMount() {
    track(events.USER_ONBOARDING_JOIN_COMMUNITIES_STEP_VIEWED);
  }

  componentDidUpdate(_, prevState) {
    const curr = this.state;

    if (
      prevState.joinedCommunities.length === 0 &&
      curr.joinedCommunities.length > 0
    ) {
      return this.showContinueButton();
    }

    if (
      prevState.joinedCommunities.length > 0 &&
      curr.joinedCommunities.length === 0
    ) {
      return this.hideContinueButton();
    }
  }

  onSearchFocus = () => {
    this.scrollView.scrollTo({ y: 0, animated: true });
    return Animated.timing(this.opacityValue, {
      toValue: 0.1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  onSearchBlur = () => {
    return Animated.timing(this.opacityValue, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  onJoinCommunity = (id: string) => {
    const { joinedCommunities } = this.state;
    track(events.USER_ONBOARDING_JOINED_COMMUNITY);
    return this.setState({
      joinedCommunities: joinedCommunities.concat(id),
    });
  };

  onLeaveCommunity = (id: string) => {
    const { joinedCommunities } = this.state;
    track(events.USER_ONBOARDING_LEFT_COMMUNITY);
    return this.setState({
      joinedCommunities: joinedCommunities.filter(c => c !== id),
    });
  };

  onSearch = (queryString: string) => {
    return this.setState({ queryString });
  };

  animateContinueButtonPosition = (val: 'in' | 'out') => {
    return Animated.spring(this.continueButtonY, {
      toValue: val === 'in' ? continueButtonVisibleY : continueButtonHiddenY,
      friction: 8,
      tension: 54,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    });
  };

  animateContinueButtonOpacity = (val: 'in' | 'out') => {
    return Animated.spring(this.continueButtonOpacity, {
      toValue: val === 'in' ? 1 : 0,
      friction: 8,
      tension: 54,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    });
  };

  showContinueButton = () => {
    return Animated.parallel([
      this.animateContinueButtonOpacity('in'),
      this.animateContinueButtonPosition('in'),
    ]).start();
  };

  hideContinueButton = () => {
    return Animated.parallel([
      this.animateContinueButtonOpacity('out'),
      this.animateContinueButtonPosition('out'),
    ]).start();
  };

  joinAndContinue = () => {
    const { joinedCommunities } = this.state;
    const { addCommunityMembers, refetch } = this.props;

    if (joinedCommunities.length === 0) return;

    this.setState({
      isJoiningCommunities: true,
    });

    return addCommunityMembers({ input: { communityIds: joinedCommunities } })
      .then(() => {
        refetch();
      })
      .catch(err => {});
  };

  render() {
    const { queryString, isJoiningCommunities } = this.state;

    return (
      <ExploreContext.Provider value={this.state}>
        <ExploreContext.Consumer>
          {ctx => <ExploreCommunitiesHeader {...ctx} />}
        </ExploreContext.Consumer>

        <ExploreCommunitiesWrapper
          keyboardDismissMode={'on-drag'}
          innerRef={c => (this.scrollView = c)}
        >
          {queryString && <ExploreSearchResults queryString={queryString} />}

          <Animated.View style={{ opacity: this.opacityValue }}>
            <ViewTitle>Find your people</ViewTitle>
            <ViewSubtitle>
              Find and join communities to get started on Spectrum. Try
              searching for interests, or explore our curated collections of
              communities below.
            </ViewSubtitle>

            <ExploreSectionHeader>Featured</ExploreSectionHeader>
            <ExploreSectionSubheader>
              Active and growing fast, these communities will get you straight
              into interesting conversations.
            </ExploreSectionSubheader>
            <CommunityUpsellCards curatedContentType="top-communities-by-members" />

            <ExploreSectionHeader>For designers</ExploreSectionHeader>
            <ExploreSectionSubheader>
              Talk about tools, process, critique, and more in these wonderful
              communities for designers.
            </ExploreSectionSubheader>
            <CommunityUpsellCards curatedContentType="design-communities" />

            <ExploreSectionHeader>For developers</ExploreSectionHeader>
            <ExploreSectionSubheader>
              Level up your skills, keep up with latest development news and
              products, and connect with like-minded builders.
            </ExploreSectionSubheader>
            <CommunityUpsellCards curatedContentType="development-communities" />

            <ExploreSectionHeader>For technologists</ExploreSectionHeader>
            <ExploreSectionSubheader>
              Keep your finger on the pulse of technology news, companies,
              startups, and more.
            </ExploreSectionSubheader>
            <CommunityUpsellCards curatedContentType="tech-communities" />

            <ExploreSectionHeader>For everyone</ExploreSectionHeader>
            <ExploreSectionSubheader>
              Be your best self in these communities dedicated to
              self-improvement, health, and fitness.
            </ExploreSectionSubheader>
            <CommunityUpsellCards curatedContentType="life-communities" />

            <View style={{ height: 48 }} />
          </Animated.View>
        </ExploreCommunitiesWrapper>

        <Animated.View
          style={{
            opacity: this.continueButtonOpacity,
            transform: [{ translateY: this.continueButtonY }],
          }}
        >
          <ContinueButtonContainer tint={'light'} intensity={97}>
            <Button
              size={'large'}
              loading={isJoiningCommunities}
              title={'Continue'}
              onPress={this.joinAndContinue}
            />
          </ContinueButtonContainer>
        </Animated.View>
      </ExploreContext.Provider>
    );
  }
}

export default compose(addCommunityMembersMutation)(ExploreCommunities);
