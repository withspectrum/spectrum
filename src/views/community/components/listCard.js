//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import { FlexRow } from '../../../components/globals';
import { TextButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

const ListCardPure = ({ data, dispatch }) => {
  const frequencies = data.community.frequencyConnection.edges;
  if (!!frequencies) {
    return (
      <StyledCard>
        <ListHeading>Frequencies</ListHeading>
        <ListContainer>
          {frequencies.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.subscribers} members`}
                >
                  <Icon glyph="forward" />
                </ListCardItem>
              </Link>
            );
          })}
        </ListContainer>
        <FlexRow>
          <MoreLink to={`/explore`}>Find more...</MoreLink>
        </FlexRow>
        <FlexRow>
          {data.community.isOwner &&
            <TextButton
              onClick={() =>
                dispatch(openModal('CREATE_FREQUENCY_MODAL', data.community))}
            >
              Create a Frequency
            </TextButton>}
        </FlexRow>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default connect()(ListCard);
