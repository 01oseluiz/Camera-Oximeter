import React from 'react';
import {IFaceProps} from './interfaces';
import { View, Text } from 'react-native';

// Styled components
import styles from './styles';

interface FacesDataProps {
  facesDetected: IFaceProps[]
};

const FacesData = (props: FacesDataProps) => {
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

  return (
    <View style={styles.facesContainer} pointerEvents="none">
      {props.facesDetected.map(renderFace)}
    </View>
  )
}

export default FacesData;
