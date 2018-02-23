// @flow
import styled, { css } from 'styled-components';
import { hexa } from 'src/components/globals';

export const ContentContainer = styled.div`
  padding: 32px;
  padding-top: 64px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 768px;
`;

export const PageTitle = styled.h1`
  font-size: 54px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  line-height: 1.2;
  margin: 48px 0 24px;
`;

export const PageSubtitle = styled.h2`
  font-size: 28px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  strong {
    font-weight: 500;
    color: ${props => props.theme.text.default};
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 72px 0 0;
`;

export const Subsection = styled.div`
  & + & {
    margin-top: 32px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  line-height: 1.3;
  margin-bottom: 16px;
`;

export const SectionSubtitle = styled.h4`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;
  margin: 16px 0;
`;

export const SectionDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  & + & {
    margin-top: 16px;
  }
`;

export const FreeFeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 48px -64px 0;
`;

export const FreeFeature = styled.li`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.06);
  background: ${props => props.theme.bg.default};
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);

  & + & {
    margin-top: 16px;
  }
`;

export const FreeFeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-right: 24px;
`;

export const FeatureIcon = styled.div`
  color: ${props => props.theme.success.default};
  display: flex;
  align-items: flex-start;
  margin-right: 16px;
`;

export const FeatureLabel = styled.h5`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.6px;
  color: ${props => props.theme.text.default};
`;

export const FeatureDescription = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  line-height: 1.4;
  margin-top: 8px;
  display: flex;
  flex: 1 0 auto;
`;

export const Highlight = styled.span`
  box-shadow: inset 0 -28px 0 rgba(74, 2, 210, 0.1);
  font-weight: 600;
  padding: 4px 0;
  line-height: 1.6;
`;

export const FreeFeatureAction = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  justify-content: flex-end;
`;

export const FreeFeatureButton = styled.button`
  -webkit-display: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);

  &:hover {
    color: ${props => props.theme.text.default};
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.bg.border};
  width: calc(100% + 64px);
  display: inline-block;
  margin: 64px -32px 0px;
`;

const PriceLabel = styled.span`
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
  letter-spacing: -0.2px;
`;

export const ModeratorsFeatureIcon = styled(FeatureIcon)`
  color: ${props => props.theme.space.default};
`;

export const ModeratorsFeatureLabel = styled(FeatureLabel)`
  color: ${props => props.theme.space.default};
`;

export const ModeratorsPriceLabel = styled(PriceLabel)`
  color: ${props => props.theme.space.default};
  background: ${props => hexa(props.theme.space.default, 0.08)};
`;

export const PrivateChannelsFeatureIcon = styled(FeatureIcon)`
  color: ${props => props.theme.special.default};
`;

export const PrivateChannelsFeatureLabel = styled(FeatureLabel)`
  color: ${props => props.theme.special.default};
`;

export const PrivateChannelsPriceLabel = styled(PriceLabel)`
  color: ${props => props.theme.special.default};
  background: ${props => hexa(props.theme.special.default, 0.08)};
`;

export const AnalyticsFeatureIcon = styled(FeatureIcon)`
  color: ${props => props.theme.success.default};
`;

export const AnalyticsFeatureLabel = styled(FeatureLabel)`
  color: ${props => props.theme.success.default};
`;

export const AnalyticsPriceLabel = styled(PriceLabel)`
  color: ${props => props.theme.success.default};
  background: ${props => hexa(props.theme.success.default, 0.08)};
`;

export const ModerationToolsFeatureIcon = styled(FeatureIcon)`
  color: ${props => props.theme.warn.alt};
`;

export const ModerationToolsFeatureLabel = styled(FeatureLabel)`
  color: ${props => props.theme.warn.alt};
`;

export const ModerationToolsPriceLabel = styled(PriceLabel)`
  color: ${props => props.theme.warn.alt};
  background: ${props => hexa(props.theme.warn.alt, 0.08)};
`;
