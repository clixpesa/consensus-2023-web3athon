import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from '@clixpesa/native-base';

import { theme } from '@clixpesa/native-base';
import { Navigation } from './navigation';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="auto" />
      <Navigation />
    </NativeBaseProvider>
  );
}
