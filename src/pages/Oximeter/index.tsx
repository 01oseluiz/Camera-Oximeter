import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarHidden } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';

// Styled components
import { CameraContainer, PermissionContainer, PermissionText } from './styles';
import { Theme } from '../../constants';

const Oximeter : React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ready, setReady] = useState(false);

  const navigation = useNavigation();

  setStatusBarHidden(true, 'slide');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission !== true) {
    return (
      <CameraContainer>
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
        <PermissionContainer>
          {hasPermission === false && <PermissionText>O aplicativo não consegue acessar a câmera</PermissionText>}
          {hasPermission === null && <PermissionText>Solicitando permissões de câmera</PermissionText>}
        </PermissionContainer>
        <AsyncButton
          styles={{
            flex: 1,
            width: '35%',
            height: '32px',
            color: Theme.colors.secondary,
            borderRadius: '5px',
            marginBottom: '10px',
          }}
          activityIndicator={{
            size: 'small',
            color: Theme.colors.light,
          }}
          asyncAction={false}
          callback={() => {
            navigation.navigate('Home');
          }}
        >
          <Icon iconPackage="AntDesign" name="back" size={22} color={Theme.colors.light} />
          <Label styles={{ marginLeft: '5px', fontSize: '22px', color: Theme.colors.light }}>Voltar</Label>
        </AsyncButton>
      </CameraContainer>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ratio="16:9"
        pictureSize="16:9"
        flashMode={Camera.Constants.FlashMode.auto}
        onFacesDetected={ready ? (event: FaceDetectionResult) => {
          console.log(event);
        } : undefined}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          tracking: true,
        }}
        onCameraReady={() => setReady(true)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back,
              );
            }}
          >
            <Icon iconPackage="Fontisto" name="arrow-swap" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default Oximeter;
