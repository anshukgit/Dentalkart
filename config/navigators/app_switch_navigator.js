import {createSwitchNavigator} from 'react-navigation';
import AuthLoading from '@screens/authloading';
import {AppStack} from './app_stack_navigator';
import {Auth} from './auth_navigator';
// import {App} from './app_drawer_navigator';

export const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    Auth,
    AppStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
