export interface ImageContainer {
  height: number,
  width: number,
  channels: number,
  data: Uint8Array,
}

const base64map : any = {};

// Build table of values
const buildTable = () : void => {
  let cont = 0;
  ['AZ', 'az', '09'].forEach((range) => {
    for (let i = range.charCodeAt(0); i <= range.charCodeAt(1); i++) {
      base64map[String.fromCharCode(i)] = cont;
      cont += 1;
    }
  });
  base64map['+'] = cont;
  cont += 1;
  base64map['/'] = cont;
};
buildTable();

const decodeBase64 = (base64: string, height: number, width: number, channels = 3): ImageContainer => {
  // const data = new Uint8Array(height * width * channels);
  const data = new Uint8Array(Math.ceil(base64.length * 0.75));

  const buffer = new Uint32Array(1);
  const view = new Uint8Array(buffer.buffer); // Should not read from the last byte

  let dataPos = 0;
  let cycle = 2;
  buffer[0] = 0; // Clear data
  for (let i = 0; i < base64.length; i++) {
    const value = base64map[base64[i]];

    buffer[0] |= value << (6 * cycle);

    cycle--;
    if (cycle < 0) {
      cycle = 2;
      for (let j = 0; j < 3; j += 1) {
        data[dataPos + j] = view[j];
      }
      dataPos += 3;
      buffer[0] = 0; // Clear data
    }
  }

  return {
    height,
    width,
    channels,
    data,
  };
};

export default decodeBase64;
