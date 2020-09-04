import React, { useEffect } from 'react';

import {
  StyleSheet, Text, View,
} from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { setStatusBarHidden } from 'expo-status-bar';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home : React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Page is in foreground
  useEffect(() => {
    setStatusBarHidden(false, 'slide');
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Label>Bora bora no App de Embarcados</Label>
      <AsyncButton
        flex={1}
        width="35%"
        height="22px"
        asyncAction
        callback={async () => {
          await new Promise((res) => setTimeout(res, 10000));
          navigation.navigate('Oximeter');
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> Iniciar </Text>
      </AsyncButton>
    </View>
  );
};

export default Home;
