import { NativeModules } from 'react-native';

const openCVFuncs = NativeModules.RNOpenCvLibrary;

export interface IRunOximeter {
  croppedImage: string
}

const runOximeter = async (imageAsBase64: string, leftEyePosition: Record<string, number>,
  rightEyePosition: Record<string, number>,
  origin: Record<string, number>,
  viewScale = 1, flipImg: boolean) : Promise<IRunOximeter> => new Promise((resolve, reject) => {
  openCVFuncs.runOximeter(imageAsBase64, leftEyePosition, rightEyePosition, origin, viewScale, flipImg, (error: unknown) => {
    reject(error);
  }, (msg: IRunOximeter) => {
    resolve(msg);
  });
});

export default {
  runOximeter,
};
