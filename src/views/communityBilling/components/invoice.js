// @flow
import * as React from 'react';
import {
  SourceContainer,
  SourceContentContainer,
  SourceText,
  SourceName,
  SourceExpiration,
} from '../style';

type Props = {
  invoice: {
    date: number,
    id: string,
    total: number,
  },
};

const formatAmount = amount =>
  (amount / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

class Source extends React.Component<Props> {
  render() {
    const { invoice } = this.props;
    const invoiceDate = new Date(invoice.date * 1000);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const paidOnString = `Paid on ${months[invoiceDate.getMonth()]}${' '}
    ${invoiceDate.getDay()}, ${invoiceDate.getFullYear()}`;

    return (
      <SourceContainer>
        <SourceContentContainer>
          <SourceText>
            <SourceName>${formatAmount(invoice.total)}</SourceName>
            <SourceExpiration>{paidOnString}</SourceExpiration>
          </SourceText>
        </SourceContentContainer>
      </SourceContainer>
    );
  }
}

export default Source;
