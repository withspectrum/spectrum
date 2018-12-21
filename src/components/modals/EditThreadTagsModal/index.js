// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { connect } from 'react-redux';
import { TextButton, Button } from '../../buttons';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../icons';
import { IconContainer } from '../RepExplainerModal/style';
import {
  Section,
  Title,
  Subtitle,
  Actions,
  modalStyles,
  TagsContainer,
  CreateTagFooter,
} from './style';
import { Checkbox } from 'src/components/formElements';
import { getThreadByIdQuery } from 'shared/graphql/queries/thread/getThread';
import {
  getCommunityThreadTagsQuery,
  type GetCommunityThreadTagsType,
} from 'shared/graphql/queries/community/getCommunityThreadTags';
import addTagsToThread, {
  type AddTagsToThreadProps,
} from 'shared/graphql/mutations/thread/addTagsToThread';
import removeTagsFromThread, {
  type RemoveTagsFromThreadProps,
} from 'shared/graphql/mutations/thread/removeTagsFromThread';
import type { Dispatch } from 'redux';
import CreateThreadTag from 'src/views/communitySettings/components/createThreadTag';
import ThreadTag from 'src/views/communitySettings/components/threadTag';

type Props = {
  thread: any,
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  community: GetCommunityThreadTagsType,
  ...$Exact<AddTagsToThreadProps>,
  ...$Exact<RemoveTagsFromThreadProps>,
};

type State = {
  loading: {
    [tagId: string]: boolean,
  },
};

class EditThreadTagsModal extends React.Component<Props, State> {
  state = {
    loading: {},
  };

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  editTag = (
    id: string,
    method: 'addTagsToThread' | 'removeTagsFromThread'
  ) => {
    this.setState(prev => ({
      loading: {
        ...prev.loading,
        [id]: true,
      },
    }));
    this.props[method]({
      threadId: this.props.thread.id,
      tagIds: [id],
    })
      .then(() => {
        this.setState(prev => ({
          loading: {
            ...prev.loading,
            [id]: false,
          },
        }));
      })
      .catch(() => {
        this.setState(prev => ({
          loading: {
            ...prev.loading,
            [id]: false,
          },
        }));
      });
  };

  render() {
    const { thread: propsThread, isOpen } = this.props;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Reputation'}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={false}
          title={null}
          closeModal={this.closeModal}
        >
          <Section data-cy="edit-thread-tags-modal">
            <Title>Edit Thread Tags</Title>

            {/* Need to load the thread from the Apollo cache anew so we update when tags are changed */}
            <Query
              query={getThreadByIdQuery}
              variables={{ id: propsThread.id }}
            >
              {({ data: { thread } }) =>
                thread && (
                  <Query
                    query={getCommunityThreadTagsQuery}
                    variables={{ id: thread.community.id }}
                  >
                    {({ data, loading, error }) => {
                      if (data && data.community)
                        return (
                          <React.Fragment>
                            <TagsContainer>
                              {data.community.threadTags
                                .sort((a, b) => {
                                  const x = new Date(a.createdAt).getTime();
                                  const y = new Date(b.createdAt).getTime();
                                  return x - y;
                                })
                                .map(tag => {
                                  const checked = thread.tags.some(
                                    ({ id }) => id === tag.id
                                  );
                                  return (
                                    <Checkbox
                                      disabled={this.state.loading[tag.id]}
                                      checked={checked}
                                      onChange={() =>
                                        this.editTag(
                                          tag.id,
                                          checked
                                            ? 'removeTagsFromThread'
                                            : 'addTagsToThread'
                                        )
                                      }
                                      key={tag.id}
                                      id={tag.id}
                                    >
                                      <span style={{ minWidth: '16px' }} />
                                      <ThreadTag
                                        tag={tag}
                                        communityId={data.community.id}
                                        tipLocation={'left'}
                                      />
                                    </Checkbox>
                                  );
                                })}
                            </TagsContainer>
                            <CreateTagFooter>
                              <CreateThreadTag
                                communityId={data.community.id}
                              />
                            </CreateTagFooter>
                          </React.Fragment>
                        );
                      if (loading) return <p>Loading</p>;
                      if (error) return <p>Error! :(</p>;
                      return null;
                    }}
                  </Query>
                )
              }
            </Query>
          </Section>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({ isOpen: state.modals.isOpen });
export default compose(
  // $FlowIssue
  connect(map),
  addTagsToThread,
  removeTagsFromThread
)(EditThreadTagsModal);
