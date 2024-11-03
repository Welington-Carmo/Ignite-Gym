import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { OneSignal } from "react-native-onesignal";

import Routes from '@routes/index';

import AuthContextProvider from '@contexts/AuthContext';

import { THEME } from './src/theme';

import Loading from '@components/Loading';

OneSignal.initialize('2d51fb27-5d61-4cb6-a230-5a8f527b72fb');
OneSignal.Notifications.requestPermission(true);


export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>

    </NativeBaseProvider>
  );
}