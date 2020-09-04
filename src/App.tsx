import 'react-native-gesture-handler';
import React from 'react';

import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */

// Custom fonts
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

// Application pages
import Home from './pages/Home';
import Oximeter from './pages/Oximeter';

const AppStack = createStackNavigator();

const App : React.FC = () => {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="black" style="light" />
      <AppStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Oximeter" component={Oximeter} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
