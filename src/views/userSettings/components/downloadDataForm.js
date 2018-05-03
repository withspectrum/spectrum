// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import styled from 'styled-components';
import { addToastWithTimeout } from 'src/actions/toasts';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Notice } from 'src/components/listItems/style';
import { Button, TextButton, OutlineButton } from 'src/components/buttons';

const Link = styled.a`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.theme.brand.default};
  padding: 12px 16px;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

type Props = {
  user: Object,
};

class DownloadDataForm extends React.Component<Props> {
  render() {
    const { user } = this.props;

    if (!user) return null;

    return (
      <SectionCard data-cy="download-data-container">
        <SectionTitle>Download my data</SectionTitle>
        <SectionSubtitle>
          You can download your personal data at any time.
        </SectionSubtitle>

        <SectionCardFooter>
          <Link
            href={
              process.env.NODE_ENV === 'production'
                ? '/api/user.json'
                : 'http://localhost:3001/api/user.json'
            }
            download
          >
            Download my data
          </Link>
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default DownloadDataForm;
