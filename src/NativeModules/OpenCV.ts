import { NativeModules } from 'react-native';

const openCVFuncs = NativeModules.RNOpenCvLibrary;

const cutImage = (imageAsBase64: string, x: number, y: number, w: number, h: number, flipImg: boolean) : Promise<string> => new Promise((resolve, reject) => {
  openCVFuncs.cutImage(imageAsBase64, x, y, w, h, flipImg, (error: unknown) => {
    reject(error)
  }, (msg: string) => {
    resolve(msg);
  });
});

export default {
  cutImage,
}
