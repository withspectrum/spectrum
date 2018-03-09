// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  getCommunityLoginById,
  type GetCommunityLoginType,
} from 'shared/graphql/queries/community/getCommunityLogin';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import BrandedLoginToggle from './brandedLoginToggle';
import Link from 'src/components/link';
import { Button, OutlineButton } from 'src/components/buttons';

type Props = {
  data: {
    community: GetCommunityLoginType,
  },
  ...$Exact<ViewNetworkHandlerType>,
};

class BrandedLogin extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading } = this.props;
    if (community) {
      const { brandedLogin } = community;
      return (
        <SectionCard>
          <SectionTitle>Branded Login</SectionTitle>
          <SectionSubtitle>
            Display a custom login message when people are signing up to
            Spectrum directly from your community’s profile
          </SectionSubtitle>

          <BrandedLoginToggle settings={brandedLogin} id={community.id} />

          {brandedLogin.isEnabled && <p>custom message</p>}

          {brandedLogin.isEnabled && (
            <SectionCardFooter>
              <Link to={`/${community.slug}/login`}>
                <OutlineButton
                  style={{ alignSelf: 'flex-start' }}
                  onClick={this.saveCustomMessage}
                >
                  Preview
                </OutlineButton>
              </Link>

              <Button
                style={{ alignSelf: 'flex-start' }}
                onClick={this.saveCustomMessage}
              >
                Save
              </Button>
            </SectionCardFooter>
          )}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getCommunityLoginById, viewNetworkHandler, connect())(
  BrandedLogin
);
