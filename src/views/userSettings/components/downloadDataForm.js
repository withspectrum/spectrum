// @flow
import theme from 'shared/theme';
import * as React from 'react';
import styled from 'styled-components';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';

const Link = styled.a`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${theme.brand.default};
  padding: 12px 16px;

  &:hover {
    color: ${theme.brand.alt};
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
