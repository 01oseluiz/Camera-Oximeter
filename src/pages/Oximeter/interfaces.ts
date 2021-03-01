export interface IFaceProps {
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
