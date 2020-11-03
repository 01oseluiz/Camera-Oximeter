interface forehead {
  x: number,
  y: number,
  width: number,
  height: number
}

/* eslint-disable no-mixed-operators */

export const calcForeheadPosition = (
  leftEyePosition: Record<string, number>,
  rightEyePosition: Record<string, number>,
  origin: Record<string, number>,
  viewScale = 1,
) : forehead => {
  const width = Math.floor(viewScale * ((1.5 * Math.abs(leftEyePosition.x - rightEyePosition.x))));
  const height = Math.floor(viewScale * (0.9 * (leftEyePosition.y + rightEyePosition.y) / 2 - origin.y));
  const x = Math.floor(viewScale * Math.min(rightEyePosition.x, leftEyePosition.x) - 0.16 * width);
  const y = Math.floor(viewScale * (0.95 * origin.y));

  return {
    width, height, x, y,
  };
};
