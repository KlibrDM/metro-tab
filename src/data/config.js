/*Default settings*/
export const yourName = "New Tab";
export const showCover = true;
export const clockBackground = false;
export const isBackgroundSolid = false;
export const backgroundSolidColor = "#3a99ff";
export const backgroundImage = "bg1";
export const tileGrow = true;
export const tileMinWidth = 20;
export const tileHeight = 55;
export const tileGap = 0;
export const tileBorder = 0;
export const tileBorderRadius = 0;
export const tileBorderColor = { r: 58, g: 153, b: 255 };
export const navbarOpacity = 0;
export const navbarColor = { r: 58, g: 153, b: 255 };
export const coverColor = { r: 58, g: 153, b: 255 };
export const coverTextColor = { r: 255, g: 255, b: 255 };

export const notes = [];

export const pages = [
  {
    link: "https://www.google.com",
    imageName: "google",
    isActive: true,
  },
  {
    link: "https://www.facebook.com",
    imageName: "facebook",
    isActive: true,
  },
  {
    link: "https://www.youtube.com",
    imageName: "youtube",
    isActive: true,
  },
  {
    link: "https://www.yahoo.com",
    imageName: "yahoo",
    isActive: true,
  },
  {
    link: "https://www.reddit.com",
    imageName: "reddit",
    isActive: true,
  },
  {
    link: "https://www.netflix.com/browse",
    imageName: "netflix",
    isActive: true,
  },
];

export const entertainmentData = [
  {
    name: "Hangman Game",
    link: "https://klibrdm.github.io/hangman-game-react",
    img: "hangman-game-icon.avif",
  },
  {
    name: "Business Club",
    link: "https://klibrdm.github.io/business-club-game",
    img: "business-club-icon.avif",
  },
];

export const backgrounds = [
  {
    name: "bg1",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg2",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg3",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg4",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg5",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg6",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg7",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg8",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg9",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg10",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg11",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg12",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg13",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg14",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg15",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg16",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg17",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg18",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg19",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "bg20",
    format: "avif",
    source: "pixabay",
  },
  {
    name: "sl1",
    format: "avif",
    source: "starline-freepik",
  },
  {
    name: "sl2",
    format: "avif",
    source: "starline-freepik",
  },
  {
    name: "sl3",
    format: "avif",
    source: "starline-freepik",
  },
  {
    name: "sl4",
    format: "avif",
    source: "starline-freepik",
  },
  {
    name: "sl5",
    format: "avif",
    source: "starline-freepik",
  },
];

export const sourceDetails = new Map([
  ['pixabay', {
    name: 'pixabay',
    label: 'Pixabay',
    url: 'https://pixabay.com/'
  }],
  ['starline-freepik', {
    name: 'starline-freepik',
    label: 'starline on Freepik',
    url: 'https://www.freepik.com/author/starline'
  }],
]);

//Known pages are the ones that have a thumbnail image
export const knownPages = [
  //V1.0
  "google",
  "facebook",
  "youtube",
  "yahoo",
  "reddit",
  "netflix",
  "github",
  "emag",
  "pcg",
  "pcgarage",
  "amazon",
  "ebay",
  "craigslist",
  "twitch",
  "9gag",
  "accuweather",
  "yr",
  "twitter",
  "vk",
  "gmail",
  "maps.google",
  "docs.google",
  "translate.google",
  "drive.google",
  "onedrive",
  "onedrive.live",
  "instagram",
  "pinterest",
  "tumblr",
  "stackoverflow",
  "codecademy",
  "w3schools",
  "php",
  "thepiratebay",
  "piratebay",
  "pirateship",
  "pirateproxy",
  "filelist",
  "kickass",
  "kat",
  "katcr",
  "aliexpress",
  "alibaba",
  "paypal",
  "olx",
  "baidu",
  "wikipedia",
  "tmall",
  "live",
  "microsoft",
  "list.tmall",
  "office",
  "msn",
  "pages.tmall",
  "yandex",
  "whatsapp",
  "spotify",
  "linkedin",
  "csdn",
  "bing",

  //V2.0 (1)
  "meet.google",
  "classroom.google",
  "teams.microsoft",
  "web.whatsapp",
  "skype",
  "web.skype",
  "zoom",
  "tiktok",
  "wish",
  "discord",
  "discordapp",
  //V2.0 (2)
  "g2a",
  "instant-gaming",
  "kinguin",
  "eneba",
  "cdkeys",
  "gamivo",
  "hrkgame",
  //V2.0 (3)
  "qq",
  "mail",
  "duckduckgo",
  "ok",
  "okru",
  "sogou",
  "globo",
  "taobao",
  "naver",
  "quora",
  "imdb",
  "uol",
  "bbc",
  "cnn",
  "booking",
  "cricbuzz",
  "jd",
  "bilibili",
  "youtu",
  "imgur",
  "foxnews",
  "rakuten",
  "viber",
  "weather",
  "walmart",
  "costco",
  "walgreens",
  "homedepot",
  "target",
  "lowes",
  "albertsons",
  "bestbuy",
  "ikea",
  "jysk",
  "newegg",
  "gamestop",

  //V2.1
  "localhost",
];
