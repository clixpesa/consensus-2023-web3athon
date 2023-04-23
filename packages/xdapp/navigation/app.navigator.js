import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-remix-icon';
import { Box, Text } from '@clixpesa/native-base';

//import { HomeScreen } from '../features/essentials';
import { SpacesNavigator } from './spaces.navigator';
import { LoansNavigator } from './loans.navigator';
import { AccountNavigator } from './account.navigator';

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Home: ['home-3-fill', 'home-3-line'],
  Spaces: ['safe-2-fill', 'safe-2-line'],
  Loans: ['hand-coin-fill', 'hand-coin-line'],
  Account: ['user-3-fill', 'user-3-line'],
};

const screenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ focused }) => (
      <Box bg={focused ? 'primary.200' : '#ffffff'} rounded="2xl" px="5" py="1" mt="1">
        <Icon name={focused ? iconName[0] : iconName[1]} size={22} color="#0F766E" />
      </Box>
    ),
    tabBarLabel: () => (
      <Text _light={{ color: 'primary.900' }} fontSize="2xs" mb="0.5">
        {route.name}
      </Text>
    ),
    tabBarHideOnKeyboard: true,
  };
};

const HomeScreen = () => {
  return (
    <Box flex={1} bg="primary.100" alignItems="center" justifyContent="center">
      <Text fontSize="xl">Home Screen!</Text>
    </Box>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Spaces" component={SpacesNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Loans" component={LoansNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};