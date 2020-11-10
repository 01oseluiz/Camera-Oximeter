import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarHidden } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';

import processVideo from './integrations';

// Styled components
import styles from './styles';
import { Theme } from '../../constants';

const Oximeter: React.FC = () => {
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [isRecording, setRecording] = useState(false);

  const navigation = useNavigation();

  setStatusBarHidden(true, 'slide');

  useEffect(() => {
    (async () => {
      let { granted } = await Permissions.getAsync(
        Permissions.CAMERA,
        Permissions.AUDIO_RECORDING,
      );

      if (!granted) {
        granted = (await Permissions.askAsync(
          Permissions.CAMERA,
          Permissions.AUDIO_RECORDING,
        )).granted;
      }

      setAllowed(granted);
    })();
  }, []);

  const recordVideo = async (): Promise<void> => {
    if (!ready) return;

    setRecording(true);
    cameraRef?.resumePreview();

    const video = await cameraRef?.recordAsync({
      quality: Camera.Constants.VideoQuality['1080p'],
      maxDuration: 2,
      mute: true,
    });

    cameraRef?.resumePreview();
    // Slice tira 'file://' para virar uma path ao invés de uri
    // IMPORTANTE, NÃO REMOVA ESSE SLICE
    processVideo(video?.uri.slice(7))
      .then((bpm) => console.log(bpm))
      .catch((error) => console.log(error));

    setRecording(false);
  };

  if (allowed !== true) {
    return (
      <View style={styles.noPermissions}>
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
        {allowed === false && <Text style={{ color: Theme.colors.dark }}>O aplicativo não consegue acessar a câmera</Text>}
        {allowed === null && <Text style={{ color: Theme.colors.dark }}>Solicitando permissões de câmera</Text>}
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Camera
          ref={(ref) => {
            setCameraRef(ref);
          }}
          style={styles.camera}
          type={type}
          ratio="16:9"
          flashMode={flash}
          onCameraReady={() => setReady(true)}
        >
          <View
            style={styles.topBar}
          >
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setType(type === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front)}
            >
              <Icon iconPackage="Ionicons" name="ios-reverse-camera" size={32} color={Theme.colors.light} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)}
            >
              <Icon iconPackage="Entypo" name="flashlight" size={32} color={(flash === Camera.Constants.FlashMode.off || type === Camera.Constants.Type.front) ? Theme.colors.light : Theme.colors.cyan} />
            </TouchableOpacity>
          </View>
          <View
            style={styles.bottomBar}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                disabled={isRecording}
                onPress={recordVideo}
              >
                <Icon iconPackage="Ionicons" name="ios-radio-button-on" size={70} color={Theme.colors.light} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    </View>
  );
};

export default Oximeter;
