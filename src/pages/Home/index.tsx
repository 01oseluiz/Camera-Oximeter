import React, { useEffect } from 'react';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { setStatusBarHidden } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';
import { Theme } from '../../constants';

import { PageContainer } from './styles';

const Home : React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Page is in foreground
  useEffect(() => {
    setStatusBarHidden(false, 'slide');
  }, [isFocused]);

  return (
    <PageContainer>
      {/* Page background */}
      <LinearGradient
        colors={['transparent', Theme.colors.secondary]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 610,
        }}
      />
      <Label styles={{ color: Theme.colors.dark, fontSize: '20px' }}>App de Embarcados</Label>
      <AsyncButton
        styles={{
          flex: 1,
          width: '35%',
          height: '32px',
          color: Theme.colors.success,
          borderRadius: '5px',
        }}
        activityIndicator={{
          size: 'small',
          color: Theme.colors.light,
        }}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Oximeter');
        }}
      >
        <Icon iconPackage="AntDesign" name="camera" size={22} color={Theme.colors.light} />
        <Label styles={{ marginLeft: '5px', fontSize: '22px', color: Theme.colors.light }}>Iniciar</Label>
      </AsyncButton>
    </PageContainer>
  );
};

export default Home;
