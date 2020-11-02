import React from 'react';
import {IFaceProps} from './interfaces';
import { View, Image } from 'react-native';
import {calcForeheadPosition} from './utils';

// Styled components
import styles from './styles';

interface FacesForeheadProps {
  facesDetected: IFaceProps[],
  lastForeheadBase64: string
};

const FacesLandmarks = (props: FacesForeheadProps) => {
  const renderForehead = (face : IFaceProps) : JSX.Element => {
    if (!(face.leftEyePosition && face.rightEyePosition && face.bounds.origin)) return (<View/>);

    const foreheadPosition = calcForeheadPosition(face.leftEyePosition, face.rightEyePosition, face.bounds.origin);

    return (
      <View
        key={face.faceID}
        style={[
          styles.forehead,
          {
            height: foreheadPosition.height,
            width: foreheadPosition.width,
            left: foreheadPosition.x,
            top: foreheadPosition.y,
          },
        ]}
      >
        <Image
          style={{width: '100%', height: '100%'}}
          source={{uri: 'data:image/png;base64,' + props.lastForeheadBase64}}
        />
      </View>
    );
  }

  return (
    <View style={styles.foreheadsContainer} pointerEvents="none">
      {props.facesDetected.map(renderForehead)}
    </View>
  );
}

export default FacesLandmarks;
