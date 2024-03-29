import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarHidden } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import AsyncButton from '../../components/AsyncButton';
import Icon from '../../components/Icon';
import Label from '../../components/Label';

import OpenCV from '../../NativeModules/OpenCV';

// Styled components
import styles from './styles';
import { Theme } from '../../constants';

interface IFaceProps {
  faceID: number,
  bounds: {
    origin: Record<string, number>,
    size: Record<string, number>,
  },
  rollAngle: number,
  yawAngle: number,
  smilingProbability: number,
  leftEarPosition: Record<string, number>,
  rightEarPosition: Record<string, number>,
  leftEyePosition: Record<string, number>,
  leftEyeOpenProbability: number,
  rightEyePosition: Record<string, number>,
  rightEyeOpenProbability: Record<string, number>,
  leftCheekPosition: Record<string, number>,
  rightCheekPosition: Record<string, number>,
  mouthPosition: Record<string, number>,
  leftMouthPosition: Record<string, number>,
  rightMouthPosition: Record<string, number>,
  noseBasePosition: Record<string, number>
}

interface CameraPictureExif {
  ApertureValue : number,
  ColorSpace : number,
  ComponentsConfiguration : string,
  DateTime : string,
  DateTimeDigitized : string,
  DateTimeOriginal : string,
  ExifVersion : string,
  ExposureBiasValue : number,
  ExposureTime : number,
  FNumber : number,
  Flash : number,
  FlashpixVersion : string,
  FocalLength : number,
  FocalLengthIn35mmFilm : number,
  ISOSpeedRatings : number,
  ImageLength : number,
  ImageUniqueID : string,
  ImageWidth : number,
  InteroperabilityIndex : string,
  LightSource : number,
  Make : string,
  MaxApertureValue : number,
  Model : string,
  Orientation : number,
  PixelXDimension : number,
  PixelYDimension : number,
  ResolutionUnit : number,
  SensingMethod : number,
  ShutterSpeedValue : number,
  Software : string,
  SubSecTime : string,
  SubSecTimeDigitized : string,
  SubSecTimeOriginal : string,
  WhiteBalance : number,
  XResolution : number,
  YCbCrPositioning : number,
  YResolution : number
}

interface CameraPicture {
  uri : string,
  width : number,
  height : number,
  exif? : CameraPictureExif,
  // base64 should be actually optional, but for this program it is obligatory
  base64: string
}

const Oximeter: React.FC = () => {
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [facesDetected, setFacesDetected] = useState<IFaceProps[]>([]);

  const navigation = useNavigation();

  /**
   * Number of recent frames to keep in recentFrames array
   *
   * @see recentFrames
   */
  const neededFrames = 8;
  /**
   * Chronologically ordered array of bitmap frames with the most recent frames
   * of the forehead. The quantity of frames it saves depends on neededFrames
   * constant.
   *
   * @see neededFrames
   */
  const recentFrames: Array<string> = [];

  setStatusBarHidden(true, 'slide');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setAllowed((status === 'granted'));
    })();
  }, []);

  const checkForBlurryImage = (imageAsBase64: string) : Promise<unknown> => new Promise((resolve, reject) => {
    OpenCV.checkForBlurryImage(imageAsBase64, (error: unknown) => {
      // error handling
    }, (msg: unknown) => {
      resolve(msg);
    });
  });

  const storeFrame = (image: CameraPicture): void => {
    checkForBlurryImage(image.base64).then((blurryPhoto) => {
      if (blurryPhoto) {
        console.log('Tá borrado');
      } else {
        console.log('Não tá borrado');
      }
    }).catch((err) => {
      console.log('err', err);
    });

    // Add new image
    recentFrames.push(image.base64);
    // Remove last one if enough images
    if (recentFrames.length > neededFrames) recentFrames.shift();
  };

  const renderFace = (face : IFaceProps) : JSX.Element => (
    <View
      key={face.faceID}
      style={[
        styles.face,
        {
          transform: [
            { perspective: 600 },
            { rotateZ: `${face.rollAngle.toFixed(0)}deg` },
            { rotateY: `${face.yawAngle.toFixed(0)}deg` },
          ],
        },
        {
          ...face.bounds.size,
          left: face.bounds.origin.x,
          top: face.bounds.origin.y,
        },
      ]}
    >
      <Text style={styles.faceText}>ID: {face.faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {face.rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {face.yawAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>BPM: 68</Text>
      <Text style={styles.faceText}>Sp02: 98%</Text>
    </View>
  );

  const renderLandmark = (face: IFaceProps) : JSX.Element => {
    const positionLandmark = (position : Record<string, number>) : JSX.Element => position && (
    <View
      style={[
        styles.landmark,
        {
          left: position.x - 1,
          top: position.y - 1,
        },
      ]}
    />
    );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {positionLandmark(face.leftEyePosition)}
        {positionLandmark(face.rightEyePosition)}
        {positionLandmark(face.leftEarPosition)}
        {positionLandmark(face.rightEarPosition)}
        {positionLandmark(face.leftCheekPosition)}
        {positionLandmark(face.rightCheekPosition)}
        {positionLandmark(face.mouthPosition)}
        {positionLandmark(face.leftMouthPosition)}
        {positionLandmark(face.rightMouthPosition)}
        {positionLandmark(face.noseBasePosition)}
      </View>
    );
  };

  const renderFaces = () : JSX.Element => (
    <View style={styles.facesContainer} pointerEvents="none">
      {facesDetected.map(renderFace)}
    </View>
  );

  const renderLandmarks = () : JSX.Element => (
    <View style={styles.facesContainer} pointerEvents="none">
      {facesDetected.map(renderLandmark)}
    </View>
  );

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
          onFacesDetected={ready ? (event: FaceDetectionResult) => {
            if (event.faces.length > 0) {
              setFacesDetected(event.faces);
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
                onPress={
                  () => {
                    cameraRef?.takePictureAsync({
                      base64: true, exif: false, skipProcessing: true, onPictureSaved: storeFrame,
                    });
                  }
                }
              >
                <Icon iconPackage="Ionicons" name="ios-radio-button-on" size={70} color={Theme.colors.light} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
        {facesDetected.length > 0 && renderFaces()}
        {facesDetected.length > 0 && renderLandmarks()}
      </View>
    </View>
  );
};

export default Oximeter;
