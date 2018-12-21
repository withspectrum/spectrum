// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
  ThreadTagContainer,
  StyledThreadTag,
  EditTagButton,
  RemoveTagButton,
  HexContainer,
  RandomSwatch,
} from '../style';
import removeThreadTagsFromCommunity, {
  type RemoveThreadTagsFromCommunityInput,
} from 'shared/graphql/mutations/community/removeThreadTagsFromCommunity';
import editThreadTagInCommunity, {
  type EditThreadTagInCommunityInput,
} from 'shared/graphql/mutations/community/editThreadTagInCommunity';
import { addToastWithTimeout } from 'src/actions/toasts';
import { getRandomHex } from './tagColors';
import { Input } from 'src/components/formElements';
import { Button } from 'src/components/buttons';
import validateStringAsHexValue from 'shared/validate-string-as-hex-value';

type Props = {
  communityId: string,
  editable: boolean,
  tag: {
    id: string,
    createdAt: string,
    hex: string,
    title: string,
  },
  removeThreadTagsFromCommunity: (
    input: RemoveThreadTagsFromCommunityInput
  ) => Promise<void>,
  editThreadTagInCommunity: (
    input: EditThreadTagInCommunityInput
  ) => Promise<void>,
};

type State = {
  title: string,
  hex: string,
  isEditing: boolean,
  isSaving: false,
};

class ThreadTag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: props.tag.title,
      hex: props.tag.hex,
      isEditing: false,
      isSaving: false,
    };
  }

  deleteTag = () => {
    const {
      removeThreadTagsFromCommunity,
      dispatch,
      tag,
      communityId,
    } = this.props;

    return removeThreadTagsFromCommunity({
      communityId,
      tagIds: [tag.id],
    })
      .then(() => dispatch(addToastWithTimeout('success', 'Tag removed')))
      .catch(err => dispatch(addToastWithTimeout('error', err.message)));
  };

  editTag = (e: any) => {
    if (this.state.title.length === 0 || this.state.isLoading) return;
    if (e) e.preventDefault();

    const { editThreadTagInCommunity, dispatch, tag, communityId } = this.props;
    const { title, hex } = this.state;

    let validatedHex = this.validateHex(hex || getRandomHex());
    if (!validatedHex) {
      return dispatch(
        addToastWithTimeout('error', 'Invalid hex value for the tag')
      );
    }

    this.setState({ isSaving: true });

    return editThreadTagInCommunity({
      tagId: tag.id,
      communityId,
      title,
      hex: validatedHex,
    })
      .then(() => {
        this.setState({ isSaving: false, isEditing: false, hex: validatedHex });
        dispatch(addToastWithTimeout('success', 'Tag saved'));
      })
      .catch(err => {
        this.setState({ isSaving: false });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleTitleChange = (e: any) => {
    const title = e.target.value;
    if (title.length >= 24) return;
    return this.setState({ title });
  };

  handleHexChange = (e: any) => {
    let val = e.target.value;
    if (val && val[0] !== '#') val = `#${val}`;
    return this.setState({ hex: val });
  };

  randomizeHex = () => {
    return this.setState({ hex: getRandomHex() });
  };

  validateHex = (hex: string): ?string => {
    return validateStringAsHexValue(hex);
  };

  toggleEdit = () => this.setState(state => ({ isEditing: !state.isEditing }));

  render() {
    const {
      tag,
      size = 'default',
      tipLocation = 'top',
      editable = false,
    } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      return (
        <ThreadTagContainer>
          <form
            onSubmit={this.editTag}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '4px',
            }}
          >
            <Input
              onChange={this.handleTitleChange}
              value={this.state.title}
              placeholder="Enter new tag title"
              style={{ marginTop: 0, marginRight: 16 }}
            />
            <Input
              onChange={this.handleHexChange}
              value={this.state.hex}
              placeholder="Hex color"
              style={{ marginTop: 0 }}
            />
            <HexContainer>
              {this.state.hex && validateStringAsHexValue(this.state.hex) && (
                <RandomSwatch
                  onClick={this.randomizeHex}
                  hex={validateStringAsHexValue(this.state.hex)}
                >
                  <Icon
                    glyph="view-reload"
                    tipText={'Randomize color'}
                    tipLocation={tipLocation}
                    size="20"
                  />
                </RandomSwatch>
              )}
            </HexContainer>
            <Button
              loading={this.state.isLoading}
              disabled={this.state.title.length === 0}
              onClick={this.editThreadTag}
              dataCy="edit-thread-tag-button"
            >
              Save
            </Button>
          </form>
          <RemoveTagButton
            onClick={this.toggleEdit}
            tipText={'Cancel'}
            tipLocation={tipLocation}
          >
            ×
          </RemoveTagButton>
        </ThreadTagContainer>
      );
    }

    return (
      <ThreadTagContainer size={size}>
        <div>
          <StyledThreadTag size={size} hex={tag.hex}>
            {tag.title}
          </StyledThreadTag>
        </div>

        {editable && (
          <div>
            <EditTagButton
              tipText={'Edit tag'}
              tipLocation={tipLocation}
              onClick={this.toggleEdit}
            >
              <Icon glyph="edit" size={20} />
            </EditTagButton>

            <RemoveTagButton
              onClick={this.deleteTag}
              tipText={'Remove tag'}
              tipLocation={tipLocation}
            >
              <Icon glyph="delete" size={20} />
            </RemoveTagButton>
          </div>
        )}
      </ThreadTagContainer>
    );
  }
}

export default compose(
  connect(),
  removeThreadTagsFromCommunity,
  editThreadTagInCommunity
)(ThreadTag);
