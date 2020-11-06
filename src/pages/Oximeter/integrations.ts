import OpenCV from '../../NativeModules/OpenCV';

const processVideo = (video: string|undefined) : Promise<unknown> => new Promise((resolve, reject) => {
  OpenCV.processVideo(video, (error: unknown) => {
    // error handling
    reject(error);
  }, (msg: unknown) => {
    resolve(msg);
    console.log(`Deu bom: ${msg}`);
  });
});

export default processVideo;
