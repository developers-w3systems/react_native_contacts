// AppWrapper.tsx
import {AppProvider, UserProvider} from '@realm/react';
import React from 'react';
import RealmWrapper from './RealmWrapper';

function AppWrapper(): JSX.Element {
  return (
    <AppProvider id={'mongodbsync-ymnsn'}>
      <UserProvider fallback={<RealmWrapper />}>
        <RealmWrapper />
      </UserProvider>
    </AppProvider>
  );
}

export default AppWrapper;
