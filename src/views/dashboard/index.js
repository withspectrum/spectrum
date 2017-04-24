//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import Card from '../../components/card';
import { Column } from '../../components/column';
import { Profile } from '../../components/profile';
import { DashboardContainer } from './style';

const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

const data = {
  photoURL: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
  title: 'Brian Lovin',
  subtitle: '@brian',
  description: 'Chief Nice Boy™ · Building @withspectrum, @designdetailsfm, @specfm · prev. @facebook, @buffer',
  meta: [
    {
      icon: 'edit',
      label: 'Posts',
      count: '14',
    },
    {
      icon: 'like',
      label: 'Reputation',
      count: '3.2k',
    },
    {
      icon: 'emoji',
      label: 'Friends',
      count: '86',
    },
  ],
};

const DashboardPure = () => (
  <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>
    <Column type={'secondary'}>
      {/* User profile */}
      <Profile data={data} />
    </Column>

    <Column type={'primary'} />
  </DashboardContainer>
);

const Dashboard = compose(pure)(DashboardPure);

export default Dashboard;
