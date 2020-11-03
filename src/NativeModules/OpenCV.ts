import { NativeModules } from 'react-native';

const openCVFuncs = NativeModules.RNOpenCvLibrary;

const cutImage = async (imageAsBase64: string, leftEyePosition: Record<string, number>,
  rightEyePosition: Record<string, number>,
  origin: Record<string, number>,
  viewScale = 1, flipImg: boolean) : Promise<string> => new Promise((resolve, reject) => {
  openCVFuncs.cutImage(imageAsBase64, leftEyePosition, rightEyePosition, origin, viewScale, flipImg, (error: unknown) => {
    reject(error);
  }, (msg: string) => {
    resolve(msg);
  });
});

export default {
  cutImage,
};
