interface forehead {
  x: number,
  y: number,
  width: number,
  height: number
};

export const calcForeheadPosition = (
    leftEyePosition: Record<string, number>,
    rightEyePosition: Record<string, number>,
    origin: Record<string, number>,
    viewScale:number = 1
  ) : forehead => {
  return {
    x: Math.floor(viewScale * ((rightEyePosition.x - 0.25*(leftEyePosition.x - rightEyePosition.x)))),
    y: Math.floor(viewScale * (0.95*origin.y)),
    width: Math.floor(viewScale * ((1.5*(leftEyePosition.x - rightEyePosition.x)))),
    height: Math.floor(viewScale * (0.9*(leftEyePosition.y + rightEyePosition.y)/2 - origin.y))
  }
}
