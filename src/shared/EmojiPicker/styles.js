import styled from 'styled-components';

export const EmojiDialog = styled.div`
  width: 276px;
  height: 220px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  bottom: 4.6rem;
  left: 1rem;
  z-index: 10;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 15px rgba(0,0,0,0.1);
`;

export const EmojiGrandlist = styled.div`
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const EmojiCategoryList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const EmojiListItem = styled.li`
  display: inline-block;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  padding: 4px;
  border-radius: 4px;

  &:hover {
  	background: #eee;
  	cursor: pointer;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0);
`;
