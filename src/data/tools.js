import { backgrounds, knownPages } from "./config";

export const getBackgroundFormat = (bg) => {
  const backgroundImageElem = backgrounds.find((background) => background.name === bg);
  let backgroundImageFormat = "avif";
  if(backgroundImageElem){
    backgroundImageFormat = backgroundImageElem.format;
  }
  return backgroundImageFormat;
};

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
};

export const checkWebsite = (pageName) => {
  if (pageName.substring(0, 4) === "http") {
    return pageName;
  } else {
    return "http://" + pageName;
  }
};

export const getImageNameForLink = (link) => {
  //Get page name from provided link
  let name = extractWebsiteName(link).toLowerCase();

  if (knownPages.includes(name)) {
    //Return the image name if the extension has it
    return name;
  } else if ("1234567890qwertyuiopasdfghjklzxcvbnm".includes(name[0])) {
    //Return the image for the first letter
    return name[0];
  } else {
    return "_";
  }
};

export const extractWebsiteName = (link) => {
  let sitename = link;

  //Remove http(s)://
  sitename = sitename.substring(sitename.indexOf("://") + 3);

  //Remove www. if existent
  if (sitename.substring(0, 3) === "www") {
    sitename = sitename.substring(4);
  }

  //Remove port if existent
  if (sitename.lastIndexOf(":") !== -1) {
    sitename = sitename.substring(0, sitename.lastIndexOf(":"));
  }

  //Remove ending (.com etc) (if found)
  if (sitename.lastIndexOf(".") !== -1) {
    sitename = sitename.substring(0, sitename.lastIndexOf("."));
  }

  //Do it twice for those that have .co or .com
  if (sitename.slice(-3) === ".co" || sitename.slice(-4) === ".com") {
    sitename = sitename.substring(0, sitename.lastIndexOf("."));
  }

  return sitename;
};

export const escapeHTML = (string) => {
  let entityMap = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#x60;",
  };
  return String(string).replace(/[<>"'`]/g, function (s) {
    return entityMap[s];
  });
};

export const compressImage = (image, maxWidth, maxHeight, quality) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      if (ratio > 1) ratio = 1; // Do not scale if smaller than max
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedImage = canvas.toDataURL("image/webp", quality !== 100 ? quality / 100 : undefined);
      resolve(compressedImage);
    };
  });
};
