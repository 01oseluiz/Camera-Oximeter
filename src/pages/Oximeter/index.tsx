import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions,
} from 'react-native';

import { Camera, FaceDetectionResult, CameraCapturedPicture } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarHidden } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';
import { IFaceProps } from './interfaces';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';
// import FacesData from './FacesData';
// import FacesLandmarks from './FacesLandmarks';
import FacesForehead from './FacesForehead';

import OpenCV from '../../NativeModules/OpenCV';

// import { calcForeheadPosition } from './utils';

// Styled components
import styles from './styles';
import { Theme } from '../../constants';

const Oximeter: React.FC = () => {
  const navigation = useNavigation();
  /**
   * Number of recent frames to keep in recentFrames array
   *
   * @see recentFrames
   */
  const neededFrames = 8;

  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [facesDetected, setFacesDetected] = useState<IFaceProps[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Chronologically ordered array of bitmap frames with the most recent frames
   * of the forehead. The quantity of frames it saves depends on neededFrames
   * constant.
   *
   * @see neededFrames
   */
  const [recentFrames, setRecentFrames] = useState<Array<string>>([]);

  setStatusBarHidden(true, 'slide');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setAllowed((status === 'granted'));
    })();
  }, []);

  const processImage = async (img: CameraCapturedPicture) : Promise<void> => {
    try {
      const currFace = facesDetected[0];
      const screenScale = img.width / Dimensions.get('screen').width;

      const croppedImg = await OpenCV.cutImage(
        img.base64 || '',
        currFace.leftEyePosition,
        currFace.rightEyePosition,
        currFace.bounds.origin,
        screenScale,
        type === Camera.Constants.Type.front,
      );
      // Add new image
      recentFrames.push(croppedImg);
      // Remove last one if enough images
      if (recentFrames.length > neededFrames) recentFrames.shift();
      setRecentFrames(recentFrames);
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
    }

    setIsProcessing(false);
  };

  const takePicture = () : void => {
    if (isProcessing) return;

    setIsProcessing(true);

    cameraRef?.takePictureAsync({
      base64: true, exif: false, skipProcessing: false, onPictureSaved: processImage,
    });
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
          pictureSize="1920x1080"
          flashMode={flash}
          onFacesDetected={ready ? (event: FaceDetectionResult) => {
            if (event.faces.length > 0) {
              setFacesDetected(event.faces);
              takePicture();
            } else {
              setFacesDetected([]);
            }
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
              >
                <Icon iconPackage="Ionicons" name="ios-radio-button-on" size={70} color={Theme.colors.light} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
        {/* {facesDetected.length > 0 && <FacesData facesDetected={facesDetected}/>} */}
        {/* {facesDetected.length > 0 && <FacesLandmarks facesDetected={facesDetected}/>} */}
        {facesDetected.length > 0 && <FacesForehead facesDetected={facesDetected} lastForeheadBase64={recentFrames[recentFrames.length - 1]} />}
      </View>
    </View>
  );
};

export default Oximeter;
