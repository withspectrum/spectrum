// @flow
import React, { useEffect, useState } from 'react';
import { useAppScroller } from 'src/hooks/useAppScroller';
import Icon from 'src/components/icon';
import { TopBottomButtonContainer, TopButton, BottomButton } from '../style';

const TopBottomButtons = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollToTop, scrollToBottom, ref } = useAppScroller();

  useEffect(() => {
    if (ref) {
      // hide on threads that don't scroll
      if (ref.scrollHeight > ref.clientHeight + 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  });

  return (
    <TopBottomButtonContainer isVisible={isVisible}>
      <TopButton onClick={scrollToTop}>
        <Icon glyph={'up-caret'} size={28} />
      </TopButton>
      <BottomButton isVisible onClick={scrollToBottom}>
        <Icon glyph={'down-caret'} size={28} />
      </BottomButton>
    </TopBottomButtonContainer>
  );
};

export default TopBottomButtons;
