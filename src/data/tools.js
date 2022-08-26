import { backgrounds } from "./config";

export const getBackgroundFormat = (bg) => {
  const backgroundImageElem = backgrounds.find((background) => background.name === bg);
  let backgroundImageFormat = "avif";
  if(backgroundImageElem){
    backgroundImageFormat = backgroundImageElem.format;
  }
  return backgroundImageFormat;
}

export const toHex = (color) => {
  let hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
  return hex;
};

export const toRGB = (hex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const clearOldExtension = (fileName) => {
  if(fileName.lastIndexOf(".jpg") !== -1){
    return fileName.slice(0, fileName.lastIndexOf(".jpg"));
  }
  else{
    return fileName;
  }
}
