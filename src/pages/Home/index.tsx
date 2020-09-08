import React, { useEffect } from 'react';

import {
  StyleSheet, Text, View,
} from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { setStatusBarHidden } from 'expo-status-bar';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';
import { Theme } from '../../constants';

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
      <Label styles={{ color: Theme.colors.blue }}>App de Embarcados</Label>
      <AsyncButton
        styles={{
          flex: 1,
          width: '35%',
          height: '32px',
        }}
        activityIndicator={{
          size: 'small',
          color: Theme.colors.light,
        }}
        asyncAction
        callback={async () => {
          await new Promise((res) => setTimeout(res, 10000));
          navigation.navigate('Oximeter');
        }}
      >
        <Icon iconPackage="AntDesign" name="windows" size={18} color={Theme.colors.light} />
        <Label styles={{ fontSize: '18px', color: 'black' }}>Iniciar</Label>
      </AsyncButton>
    </View>
  );
};

export default Home;
