import styled from 'styled-components';

export default styled.div`
  display: flex;
  position: relative;
  height: 100%;
  max-height: 100%;
  overflow-y: scroll;

  @media (max-width: 768px) {
    flex: 1 0 auto;
    width: 100%;
  }
`;
