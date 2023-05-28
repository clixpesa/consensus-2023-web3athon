import { Box, Text } from '@clixpesa/native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SpacesStack = createNativeStackNavigator();

import { SpacesHomeScreen } from '../features/spaces';

export const SpacesNavigator = () => {
  return (
    <SpacesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SpacesStack.Screen name="Main" component={SpacesHomeScreen} />
    </SpacesStack.Navigator>
  );
};
