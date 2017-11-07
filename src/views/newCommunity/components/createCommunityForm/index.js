import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import slugg from 'slugg';
import { withApollo } from 'react-apollo';
import { track } from '../../../../helpers/events';
import { Notice } from '../../../../components/listItems/style';
import Avatar from '../../../../components/avatar';
import { throttle } from '../../../../helpers/utils';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { COMMUNITY_SLUG_BLACKLIST } from 'shared/slug-blacklists';
import {
  createCommunityMutation,
  CHECK_UNIQUE_COMMUNITY_SLUG_QUERY,
  SEARCH_COMMUNITIES_QUERY,
} from '../../../../api/community';
import { Button } from '../../../../components/buttons';
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  CoverInput,
  Error,
  Checkbox,
} from '../../../../components/formElements';
import {
  ImageInputWrapper,
  Spacer,
  CommunitySuggestionsWrapper,
  CommunitySuggestion,
  CommunitySuggestionsText,
} from './style';
import { FormContainer, Form, Actions } from '../../style';

class CreateCommunityForm extends Component {
  state: {
    name: ?string,
    slug: string,
    description: string,
    website: string,
    image: string,
    coverPhoto: string,
    file: ?Object,
    coverFile: ?Object,
    slugTaken: boolean,
    slugError: boolean,
    descriptionError: boolean,
    nameError: boolean,
    createError: boolean,
    isLoading: boolean,
    agreeCoC: boolean,
    photoSizeError: boolean,
    communitySuggestions: ?Array<Object>,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: props.name || '',
      slug: '',
      description: '',
      website: '',
      image: '',
      coverPhoto: '',
      file: null,
      coverFile: null,
      slugTaken: false,
      slugError: false,
      descriptionError: false,
      nameError: false,
      createError: false,
      isLoading: false,
      agreeCoC: false,
      photoSizeError: false,
      communitySuggestions: null,
    };

    this.checkSlug = throttle(this.checkSlug, 500);
  }

  componentDidMount() {
    track('community', 'create inited', null);
  }

  changeName = e => {
    const { communitySuggestions } = this.state;
    if (communitySuggestions) {
      this.setState({
        communitySuggestions: null,
      });
    }

    const name = e.target.value;
    // replace any non alpha-num characters to prevent bad community slugs
    // (/[\W_]/g, "-") => replace non-alphanum with hyphens
    // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
    let lowercaseName = name
      .toLowerCase()
      .trim()
      .replace(/[\W_]/g, '-')
      .replace(/-{2,}/g, '-');
    let slug = slugg(lowercaseName);

    if (name.length >= 20) {
      this.setState({
        nameError: true,
      });

      return;
    }

    if (COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1) {
      this.setState({
        name,
        slug,
        slugTaken: true,
      });
    } else {
      this.setState({
        name,
        slug,
        nameError: false,
        slugTaken: false,
      });

      this.checkSlug(slug);
    }
  };

  changeSlug = e => {
    let slug = e.target.value;
    // replace any non alpha-num characters to prevent bad community slugs
    // (/[\W_]/g, "-") => replace non-alphanum with hyphens
    // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
    let lowercaseSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[\W_]/g, '-')
      .replace(/-{2,}/g, '-');
    slug = slugg(lowercaseSlug);

    if (slug.length >= 24) {
      this.setState({
        slug,
        slugError: true,
      });

      return;
    }

    if (COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1) {
      this.setState({
        slug,
        slugTaken: true,
      });
    } else {
      this.setState({
        slug,
        slugError: false,
        slugTaken: false,
      });

      this.checkSlug(slug);
    }
  };

  checkSlug = slug => {
    // check the db to see if this channel slug exists
    this.props.client
      .query({
        query: CHECK_UNIQUE_COMMUNITY_SLUG_QUERY,
        variables: {
          slug,
        },
      })
      .then(({ data }) => {
        if (COMMUNITY_SLUG_BLACKLIST.indexOf(this.state.slug) > -1) {
          return this.setState({
            slugTaken: true,
          });
        }
        // if the community exists
        if (!data.loading && data && data.community && data.community.id) {
          return this.setState({
            slugTaken: true,
          });
        } else {
          this.setState({
            slugTaken: false,
          });
        }
      });
  };

  checkSuggestedCommunities = () => {
    const { name, slug, slugError } = this.state;
    if (name && name.length > 1 && slug && slug.length > 1 && !slugError) {
      // if the user has found a valid url, do a community search to see if they might be creating a duplicate community
      this.props.client
        .query({
          query: SEARCH_COMMUNITIES_QUERY,
          variables: {
            string: slug,
            amount: 10,
          },
        })
        .then(({ data: { searchCommunities: communitySuggestions } }) => {
          const filtered =
            communitySuggestions &&
            communitySuggestions
              .slice()
              .sort((a, b) => b.metaData.members - a.metaData.members)
              .slice(0, 5);

          if (filtered && filtered.length > 0) {
            this.setState({
              communitySuggestions: filtered,
            });
          } else {
            this.setState({
              communitySuggestions: null,
            });
          }
        });
    }
  };

  changeDescription = e => {
    const description = e.target.value;
    if (description.length >= 140) {
      this.setState({
        descriptionError: true,
      });
      return;
    }

    this.setState({
      description,
      descriptionError: false,
    });
  };

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  changeCoC = () => {
    const value = this.state.agreeCoC;
    this.setState({
      agreeCoC: !value,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
      });
    }

    reader.onloadend = () => {
      track('community', 'profile photo uploaded', null);
      this.setState({
        file: file,
        image: reader.result,
        photoSizeError: false,
      });
    };

    reader.readAsDataURL(file);
  };

  setCommunityCover = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
      });
    }

    reader.onloadend = () => {
      track('community', 'cover photo uploaded', null);
      this.setState({
        coverFile: file,
        coverPhoto: reader.result,
        photoSizeError: false,
      });
    };

    reader.readAsDataURL(file);
  };

  create = e => {
    e.preventDefault();
    const {
      name,
      slug,
      description,
      website,
      file,
      coverFile,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
      photoSizeError,
      agreeCoC,
    } = this.state;

    // if an error is present, ensure the client cant submit the form
    if (
      slugTaken ||
      nameError ||
      descriptionError ||
      slugError ||
      photoSizeError ||
      !name ||
      !slug ||
      !description ||
      !agreeCoC
    ) {
      this.setState({
        createError: true,
      });

      return;
    }

    // clientside checks have passed
    this.setState({
      createError: false,
      isLoading: true,
    });

    // create the mutation input
    const input = {
      name,
      slug,
      description,
      website,
      file,
      coverFile,
    };

    // create the community
    this.props
      .createCommunity(input)
      .then(({ data: { createCommunity } }) => {
        track('community', 'created', null);
        this.props.communityCreated(createCommunity);
        this.props.dispatch(
          addToastWithTimeout('success', 'Community created!')
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      name,
      slug,
      description,
      image,
      coverPhoto,
      website,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
      createError,
      isLoading,
      agreeCoC,
      photoSizeError,
      communitySuggestions,
    } = this.state;

    const suggestionString = slugTaken
      ? communitySuggestions && communitySuggestions.length > 0
        ? `Were you looking for one of these communities?`
        : null
      : `This community name and url are available! We also found communities that might be similar to what you're trying to create, just in case you would rather join an existing community instead!`;

    const isMobile = window.innerWidth < 768;

    return (
      <FormContainer>
        <Form>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCommunityCover}
              defaultValue={coverPhoto}
              preview={true}
              allowGif
            />

            <PhotoInput
              onChange={this.setCommunityPhoto}
              defaultValue={image}
              user={null}
              community
              allowGif
            />
          </ImageInputWrapper>

          {photoSizeError && (
            <Notice style={{ marginTop: '32px' }}>
              Photo uploads should be less than 3mb
            </Notice>
          )}

          <Spacer height={8} />

          <Input
            defaultValue={name}
            onChange={this.changeName}
            autoFocus={!isMobile}
            onBlur={this.checkSuggestedCommunities}
          >
            What is your community called?
          </Input>

          {nameError && (
            <Error>Community names can be up to 20 characters long.</Error>
          )}

          <UnderlineInput
            defaultValue={slug}
            onChange={this.changeSlug}
            onBlur={this.checkSuggestedCommunities}
          >
            sp.chat/
          </UnderlineInput>

          {slugTaken && (
            <Error>
              This url is already taken - feel free to change it if you're set
              on the name {name}!
            </Error>
          )}

          {slugError && <Error>Slugs can be up to 24 characters long.</Error>}

          {suggestionString &&
            !nameError &&
            !slugError &&
            communitySuggestions &&
            communitySuggestions.length > 0 && (
              <CommunitySuggestionsText>
                {suggestionString}
              </CommunitySuggestionsText>
            )}

          <CommunitySuggestionsWrapper>
            {!nameError &&
              !slugError &&
              communitySuggestions &&
              communitySuggestions.length > 0 &&
              communitySuggestions.map(suggestion => {
                return (
                  <Link to={`/${suggestion.slug}`} key={suggestion.id}>
                    <CommunitySuggestion>
                      <Avatar
                        size={20}
                        radius={4}
                        community
                        src={suggestion.profilePhoto}
                      />
                      <strong>{suggestion.name}</strong>{' '}
                      {suggestion.metaData.members.toLocaleString()} members
                    </CommunitySuggestion>
                  </Link>
                );
              })}
          </CommunitySuggestionsWrapper>

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Describe it in 140 characters or less
          </TextArea>

          {descriptionError && (
            <Error>
              Oop, that's more than 140 characters - try trimming that up.
            </Error>
          )}

          <Input defaultValue={website} onChange={this.changeWebsite}>
            Optional: Add your community's website
          </Input>

          <Checkbox id="isPrivate" checked={agreeCoC} onChange={this.changeCoC}>
            <span>
              I have read the{' '}
              <a
                href="https://github.com/withspectrum/code-of-conduct"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spectrum Code of Conduct
              </a>{' '}
              and agree to enforce it in my community.
            </span>
          </Checkbox>

          {createError && (
            <Error>
              Please fix any errors above before creating this community.
            </Error>
          )}
        </Form>

        <Actions>
          <div />
          <Button
            onClick={this.create}
            disabled={
              slugTaken ||
              slugError ||
              nameError ||
              createError ||
              descriptionError ||
              !name ||
              !description ||
              !agreeCoC
            }
            loading={isLoading}
          >
            Create Community & Continue
          </Button>
        </Actions>
      </FormContainer>
    );
  }
}

export default compose(
  createCommunityMutation,
  withRouter,
  connect(),
  withApollo
)(CreateCommunityForm);
