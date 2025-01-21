import * as CONFIG from "./config";
import { userData } from "../store";

export const saveConfig = (data) => {
  localStorage.setItem("ft", true);
  localStorage.setItem("yourName", data.yourName);
  localStorage.setItem("showCover", data.showCover);
  localStorage.setItem("clockBackground", data.clockBackground);
  localStorage.setItem("clock24Hour", data.clock24Hour);
  localStorage.setItem("darkMode", data.darkMode);
  localStorage.setItem("isBackgroundSolid", data.isBackgroundSolid);
  localStorage.setItem("backgroundSolidColor", data.backgroundSolidColor);
  localStorage.setItem("backgroundImage", data.backgroundImage);
  localStorage.setItem("tileZoom", data.tileZoom);
  localStorage.setItem("tileGrow", data.tileGrow);
  localStorage.setItem("tileMinWidth", data.tileMinWidth);
  localStorage.setItem("tileHeight", data.tileHeight);
  localStorage.setItem("tileGap", data.tileGap);
  localStorage.setItem("tileBorder", data.tileBorder);
  localStorage.setItem("tileBorderRadius", data.tileBorderRadius);
  localStorage.setItem("tileBorderColor", JSON.stringify(data.tileBorderColor));
  localStorage.setItem("groupTileGap", data.groupTileGap);
  localStorage.setItem("groupTileBorderRadius", data.groupTileBorderRadius);
  localStorage.setItem("groupTileGrow", data.groupTileGrow);
  localStorage.setItem("navbarOpacity", data.navbarOpacity);
  localStorage.setItem("navbarColor", JSON.stringify(data.navbarColor));
  localStorage.setItem("coverColor", JSON.stringify(data.coverColor));
  localStorage.setItem("coverTextColor", JSON.stringify(data.coverTextColor));
  localStorage.setItem("notes", JSON.stringify(data.notes));
  localStorage.setItem("pages", JSON.stringify(data.pages));
  localStorage.setItem("searchEngine", data.searchEngine);
};

export const saveBackground = (bg) => {
  localStorage.setItem("backgroundImage", bg);
  localStorage.setItem("isBackgroundSolid", false);
};

export const saveBackgroundColor = (color) => {
  localStorage.setItem("backgroundSolidColor", color);
  localStorage.setItem("isBackgroundSolid", true);
};

export const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

export const saveTileImage = (link, image) => {
  localStorage.setItem(link, image);
}

export const saveSearchEngine = (engine) => {
  localStorage.setItem("searchEngine", engine);
}

export const getTileImage = (link) => {
  return localStorage.getItem(link);
}

export const getTileImageLinks = () => {
  let links = [];
  for (let key in localStorage) {
    if (key.indexOf("http") !== -1) {
      links.push(key);
    }
  }
  return links;
}

/*Load data from localstorage
If the extension can't get the item from localstorage, use the value from config
(simple || if not bool, ? : if bool)*/
//prettier-ignore
const data = {
  yourName: 
    localStorage.getItem("yourName") ||
    CONFIG.yourName,

  showCover: 
    localStorage.getItem("showCover") === null 
    ? CONFIG.showCover
    : localStorage.getItem("showCover") === "true",

  clockBackground:
    localStorage.getItem("clockBackground") === null
    ? CONFIG.clockBackground
    : localStorage.getItem("clockBackground") === "true",

  clock24Hour:
    localStorage.getItem("clock24Hour") === null
    ? CONFIG.clock24Hour
    : localStorage.getItem("clock24Hour") === "true",

  darkMode:
    localStorage.getItem("darkMode") === null
    ? CONFIG.darkMode
    : localStorage.getItem("darkMode") === "true",

  isBackgroundSolid:
    localStorage.getItem("isBackgroundSolid") === null
    ? CONFIG.isBackgroundSolid
    : localStorage.getItem("isBackgroundSolid") === "true",

  backgroundSolidColor:
    localStorage.getItem("backgroundSolidColor") ||
    CONFIG.backgroundSolidColor,

  backgroundImage:
    localStorage.getItem("backgroundImage") ||
    CONFIG.backgroundImage,

  tileZoom:
    localStorage.getItem("tileZoom") === null
    ? CONFIG.tileZoom
    : localStorage.getItem("tileZoom") === "true",

  tileGrow:
    localStorage.getItem("tileGrow") === null
    ? CONFIG.tileGrow
    : localStorage.getItem("tileGrow") === "true",

  tileMinWidth:
    localStorage.getItem("tileMinWidth") ||
    CONFIG.tileMinWidth,

  tileHeight:
    localStorage.getItem("tileHeight") ||
    CONFIG.tileHeight,

  tileGap:
    localStorage.getItem("tileGap") ||
    CONFIG.tileGap,

  tileBorder:
    localStorage.getItem("tileBorder") ||
    CONFIG.tileBorder,

  tileBorderRadius:
    localStorage.getItem("tileBorderRadius") ||
    CONFIG.tileBorderRadius,

  tileBorderColor:
    JSON.parse(localStorage.getItem("tileBorderColor")) ||
    CONFIG.tileBorderColor,

  groupTileGap:
    localStorage.getItem("groupTileGap") ||
    CONFIG.groupTileGap,

  groupTileBorderRadius:
    localStorage.getItem("groupTileBorderRadius") ||
    CONFIG.groupTileBorderRadius,

  groupTileGrow:
    localStorage.getItem("groupTileGrow") === null
    ? CONFIG.groupTileGrow
    : localStorage.getItem("groupTileGrow") === "true",

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

  searchEngine:
    localStorage.getItem("searchEngine") ||
    CONFIG.searchEngine,
};

/*Import pages data from legacy 1.1 version
Data was stored in cookies instead of local storage*/
let legacyPagesCookie = getCookie("pages");

if (legacyPagesCookie != null) {
  let oldPages = [];
  let legacyPagesParsedCookie = JSON.parse(legacyPagesCookie);

  //Old data also had a different format
  //Therefore it has to be converted
  legacyPagesParsedCookie.forEach((page, index) => {
    oldPages[index] = {
      link: page[0],
      imageName: page[1],
      isActive: page[2] ? true : false,
      tileImageType: page[1].length > 1 ? 'predefined' : 'none',
      tileName: page[1][0].toUpperCase() + page[1].slice(1),
      backgroundColor: "#3a99ff",
      textColor: "#ffffff"
    };
  });

  data.pages = oldPages;
  eraseCookie("pages");
  saveConfig(data);
}

/* Add new properties to old pages (missing on version 2.1 and before) */
if (data.pages) {
  data.pages.forEach(page => {
    if (page.isGroup) {
      return;
    }

    if (!page.hasOwnProperty("tileImageType")) {
      page.tileImageType = page.imageName.length > 1 ? 'predefined' : 'none';
    }
    if (!page.hasOwnProperty("tileName")) {
      page.tileName = page.imageName[0].toUpperCase() + page.imageName.slice(1);
    }
    if (!page.hasOwnProperty("backgroundColor")) {
      page.backgroundColor = "#3a99ff";
    }
    if (!page.hasOwnProperty("textColor")) {
      page.textColor = "#ffffff";
    }
  });
  localStorage.setItem("pages", JSON.stringify(data.pages));
}

/* Add new properties to old notes (missing on version 2.4.0 and before) */
export const parseNotes = (notes) => {
  if (notes && notes.length) {
    notes.forEach(note => {
      let type = "note"; // keep track of note type to determine default colors
      if (!note.hasOwnProperty("text")) {
        note.text = "";
      }
  
      if (!note.hasOwnProperty("type")) {
        note.type = type;
      }
      else {
        // If note has a type, store it to determine default colors
        type = note.type;
      }
  
      if (!note.hasOwnProperty("textColor")) {
        note.textColor = type === "note" ? CONFIG.notesColors[0].text : CONFIG.notesColors[1].text;
      }
      if (!note.hasOwnProperty("backgroundColor")) {
        note.backgroundColor = type === "note" ? CONFIG.notesColors[0].background : CONFIG.notesColors[1].background;
      }
  
      if (!note.hasOwnProperty("important")) {
        note.important = false;
      }
      if (!note.hasOwnProperty("completed")) {
        note.completed = false;
      }
      if (!note.hasOwnProperty("isPinned")) {
        note.isPinned = false;
      }
    });
  }
  return notes;
}

data.notes = parseNotes(data.notes);
if (data.notes && data.notes.length) {
  localStorage.setItem("notes", JSON.stringify(data.notes));
}

//After loading the data, set it to state
userData.set(data);

//Cookie management functions to restore legacy data
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}
