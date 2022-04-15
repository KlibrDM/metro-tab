import * as CONFIG from "./config";
import { userData } from "../store";

export const saveConfig = (data) => {
  localStorage.setItem("ft", true);
  localStorage.setItem("yourName", data.yourName);
  localStorage.setItem("isBackgroundWhite", data.isBackgroundWhite);
  localStorage.setItem("showCover", data.showCover);
  localStorage.setItem("clockBackground", data.clockBackground);
  localStorage.setItem("backgroundImage", data.backgroundImage);
  localStorage.setItem("tileMinWidth", data.tileMinWidth);
  localStorage.setItem("tileHeight", data.tileHeight);
  localStorage.setItem("tileGap", data.tileGap);
  localStorage.setItem("navbarOpacity", data.navbarOpacity);
  localStorage.setItem("navbarColor", JSON.stringify(data.navbarColor));
  localStorage.setItem("coverColor", JSON.stringify(data.coverColor));
  localStorage.setItem("coverTextColor", JSON.stringify(data.coverTextColor));
  localStorage.setItem("notes", JSON.stringify(data.notes));
  localStorage.setItem("pages", JSON.stringify(data.pages));
};

export const saveBackground = (bg) => {
  localStorage.setItem("backgroundImage", bg);
};

export const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

/*Load data from localstorage
If the extension can't get the item from localstorage, use the value from config
(simple || if not bool, ? : if bool)*/
//prettier-ignore
const data = {
  yourName: 
    localStorage.getItem("yourName") ||
    CONFIG.yourName,

  isBackgroundWhite:
    localStorage.getItem("isBackgroundWhite") === null
    ? CONFIG.isBackgroundWhite
    : localStorage.getItem("isBackgroundWhite") === "true",

  showCover: 
    localStorage.getItem("showCover") === null 
    ? CONFIG.showCover
    : localStorage.getItem("showCover") === "true",

  clockBackground:
    localStorage.getItem("clockBackground") === null
    ? CONFIG.clockBackground
    : localStorage.getItem("clockBackground") === "true",

  backgroundImage:
    localStorage.getItem("backgroundImage") ||
    CONFIG.backgroundImage,

  tileMinWidth:
    localStorage.getItem("tileMinWidth") ||
    CONFIG.tileMinWidth,

  tileHeight:
    localStorage.getItem("tileHeight") ||
    CONFIG.tileHeight,

  tileGap:
    localStorage.getItem("tileGap") ||
    CONFIG.tileGap,

  navbarOpacity:
    localStorage.getItem("navbarOpacity") ||
    CONFIG.navbarOpacity,

  navbarColor:
    JSON.parse(localStorage.getItem("navbarColor")) ||
    CONFIG.navbarColor,

  coverColor:
    JSON.parse(localStorage.getItem("coverColor")) ||
    CONFIG.coverColor,

  coverTextColor:
    JSON.parse(localStorage.getItem("coverTextColor")) ||
    CONFIG.coverTextColor,

  notes:
    JSON.parse(localStorage.getItem("notes")) ||
    CONFIG.notes,

  pages:
    JSON.parse(localStorage.getItem("pages")) ||
    CONFIG.pages,
};

//After loading the data, set it to state
userData.set(data);
