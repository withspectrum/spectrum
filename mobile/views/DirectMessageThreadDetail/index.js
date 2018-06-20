// @flow
import * as React from 'react';
import { Share } from 'react-native';
import compose from 'recompose/compose';
import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from '../../../shared/graphql/queries/directMessageThread/getDirectMessageThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import { FullscreenNullState } from '../../components/NullStates';
import { Wrapper } from './style';
import {
  ListItemWithButton,
  ListSection,
  ListSectionDivider,
  UserListItem,
} from '../../components/Lists';
import type { NavigationProps } from 'react-navigation';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: NavigationProps,
  data: {
    directMessageThread?: GetDirectMessageThreadType,
  },
};

class DirectMessageThreadDetail extends React.Component<Props> {
  share = () => {
    const { directMessageThread } = this.props.data;

    if (!directMessageThread) return;

    return Share.share(
      {
        url: `https://spectrum.chat/messages/${directMessageThread.id}`,
        title: `Direct message on Spectrum`,
      },
      {
        subject: `Direct message on Spectrum`,
      }
    );
  };

  render() {
    const {
      data: { directMessageThread },
      isLoading,
      hasError,
      navigation,
    } = this.props;

    if (directMessageThread && directMessageThread.id) {
      const { participants } = directMessageThread;

      return (
        <Wrapper>
          <ListSectionDivider title={'Participants'} />

          <ListSection>
            {participants.map((user, index) => (
              <UserListItem
                user={user}
                onPressHandler={() =>
                  navigation.navigate({
                    routeName: 'User',
                    key: user.userId,
                    params: { id: user.userId },
                  })
                }
                key={user.id}
                divider={index !== participants.length - 1}
              />
            ))}
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            <ListItemWithButton
              onPressHandler={this.share}
              title={'Share'}
              divider={false}
            />
          </ListSection>

          <ListSectionDivider />
          <ListSectionDivider />
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

export default compose(getDirectMessageThread, ViewNetworkHandler)(
  DirectMessageThreadDetail
);
