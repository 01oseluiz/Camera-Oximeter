import 'react-native-gesture-handler';
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Application pages
import Home from './pages/Home';
import Oximeter from './pages/Oximeter';

const AppStack = createStackNavigator();

/* eslint-disable react/style-prop-object */
const App : React.FC = () => (
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

export default App;
