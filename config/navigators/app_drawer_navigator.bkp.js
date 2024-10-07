import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppStack} from './app_stack_navigator';
import DrawerSidebar from '@components/drawersidebar';

const DrawerComponent = props => {
  return <DrawerSidebar navigation={props.navigation} />;
};

export const App = createDrawerNavigator({
  AppStack: {
    screen: AppStack,
  },
});
