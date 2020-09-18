import React, { useState, useEffect } from 'react';

import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarHidden } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';

// Styled components
import {
  BottomBar,
  CameraButton,
  CameraContainer,
  CameraOverlay,
  PermissionContainer,
  PermissionText,
} from './styles';
import { Theme } from '../../constants';

const Oximeter : React.FC = () => {
  const [camera, setCamera] = useState({
    allowed: false,
    ready: false,
    flash: Camera.Constants.FlashMode.off,
    type: Camera.Constants.Type.back,
  });
  const navigation = useNavigation();

  setStatusBarHidden(true, 'slide');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCamera({ ...camera, allowed: (status === 'granted') });
    })();
  }, []);

  if (camera.allowed !== true) {
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
          {camera.allowed === false && <PermissionText>O aplicativo não consegue acessar a câmera</PermissionText>}
          {camera.allowed === null && <PermissionText>Solicitando permissões de câmera</PermissionText>}
          <AsyncButton
            styles={{
              flex: 1,
              width: '70%',
              height: '32px',
              color: Theme.colors.secondary,
              borderRadius: '5px',
              marginTop: '10px',
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
        </PermissionContainer>
      </CameraContainer>
    );
  }

  return (
    <CameraContainer>
      <Camera
        style={{ flex: 1 }}
        type={camera.type}
        ratio="16:9"
        flashMode={camera.flash}
        onFacesDetected={camera.ready ? (event: FaceDetectionResult) => {
          console.log(event);
        } : undefined}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          tracking: true,
        }}
        onCameraReady={() => setCamera({ ...camera, ready: true })}
      >
        <CameraOverlay>
          <BottomBar>
            <CameraButton
              activeOpacity={0.8}
              onPress={() => {
                setCamera({
                  ...camera,
                  type: camera.type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                });
              }}
            >
              <Icon iconPackage="Fontisto" name="arrow-swap" size={30} color={Theme.colors.light} />
            </CameraButton>
            <CameraButton
              activeOpacity={0.8}
            >
              <Icon iconPackage="MaterialCommunityIcons" name="record" size={50} color={Theme.colors.light} />
            </CameraButton>
            <CameraButton
              activeOpacity={0.8}
              onPress={() => {
                setCamera({
                  ...camera,
                  flash: camera.flash === Camera.Constants.FlashMode.torch
                    ? Camera.Constants.FlashMode.off
                    : Camera.Constants.FlashMode.torch,
                });
              }}
            >
              <Icon iconPackage="Entypo" name="flashlight" size={40} color={camera.flash === Camera.Constants.FlashMode.torch ? Theme.colors.blue : Theme.colors.light} />
            </CameraButton>
          </BottomBar>
        </CameraOverlay>
      </Camera>
    </CameraContainer>
  );
};

export default Oximeter;
