import React from 'react';
import {IFaceProps} from './interfaces';
import { View } from 'react-native';

// Styled components
import styles from './styles';

interface FacesLandmarksProps {
  facesDetected: IFaceProps[]
};

const FacesLandmarks = (props: FacesLandmarksProps) => {
  const renderLandmark = (face: IFaceProps) : JSX.Element => {
    const positionLandmark = (position : Record<string, number>) : JSX.Element => (
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

  return (
    <View style={styles.facesContainer} pointerEvents="none">
      {props.facesDetected.map(renderLandmark)}
    </View>
  );
}

export default FacesLandmarks;
