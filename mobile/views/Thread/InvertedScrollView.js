// @flow
import * as React from 'react';
import styled from 'styled-components/native';
import { ScrollView, type ScrollViewPropTypes } from 'react-native';

type Props = {
  ...$Exact<ScrollViewPropTypes>,
};

class InvertibleScrollView extends React.Component<Props> {
  renderInvertedChildren = (children: Array<any>) => {
    return React.Children.map(children, child => {
      return child ? <InvertedChild>{child}</InvertedChild> : child;
    });
  };

  render() {
    return (
      <StyledScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <ContentWrapper>
          {this.renderInvertedChildren(this.props.children)}
        </ContentWrapper>
      </StyledScrollView>
    );
  }
}

const StyledScrollView = styled(ScrollView)`
  flex: 1;
  width: 100%;
  height: 100%;
  transform: scaleY(-1);
`;

const ContentWrapper = styled.View`
  height: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const InvertedChild = styled.View`
  transform: scaleY(-1);
`;

export default InvertibleScrollView;
