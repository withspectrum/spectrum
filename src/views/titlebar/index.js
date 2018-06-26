import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { LikeButton } from 'src/components/threadLikes';
import Link from 'src/components/link';
import ThreadSearch from '../dashboard/components/threadSearch';
import Icon from '../../components/icons';
import { IconButton } from '../../components/buttons';
import { TitleBar, Text, Subtitle, Title } from './style';

const TextHeading = ({ title, subtitle }) => (
  <Text>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {title && <Title large={!subtitle}>{title}</Title>}
  </Text>
);

class Titlebar extends Component {
  handleBack = () => {
    const { history } = this.props;
    const length = history.length;

    /*
      We don't have a reliable way to know exactly where a user should navigate
      to when they hit the back button. For example, suppose you see a link
      to Spectrum on Twitter - you open Spectrum and read the story. If you
      click the 'back' button in the titlebar, where should you go? To the
      channel the thread was posted in? To the home page?

      What we can do - roughly - is look at the length provided by the
      router history. If it is greater than 3, we can assume the user has
      already navigated on the site before and would expect the back behavior
      to only move back one step in the history. If the location length is less
      than 3, we might assume that the user *just* landed on a page, in which
      case we need to provide an explicit backRoute via a prop.

      This backRoute will often be just a link to '/' although in some cases
      we can make good assumptions (i.e. if a user lands directly on a channel
      page, the back button can take them to the community for that channel).
    */
    if (length > 3) {
      history.goBack();
    } else {
      history.push(this.props.backRoute);
    }
  };

  render() {
    const {
      title,
      subtitle,
      provideBack,
      noComposer,
      hasChildren,
      hasSearch,
      filter,
      children,
      messageComposer,
    } = this.props;
    return (
      <TitleBar>
        {provideBack ? (
          <IconButton
            glyph="view-back"
            color="text.reverse"
            onClick={this.handleBack}
          />
        ) : hasChildren ? (
          children
        ) : null}
        {title || subtitle ? (
          <TextHeading subtitle={subtitle} title={title} />
        ) : hasSearch ? (
          <ThreadSearch filter={filter} darkContext />
        ) : (
          <Icon glyph="logo" />
        )}

        {noComposer ? null : messageComposer ? (
          <Link to={`/messages/new`}>
            <IconButton glyph="message-new" color="text.reverse" />
          </Link>
        ) : (
          <Link to={`/new/thread`}>
            <IconButton glyph="post" color="text.reverse" />
          </Link>
        )}
      </TitleBar>
    );
  }
}

export default compose(withRouter)(Titlebar);
