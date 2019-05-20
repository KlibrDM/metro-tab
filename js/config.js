/*Default settings*/
var yourName = "New Tab";
var isBackgroundWhite = false;
var backgroundImage = "bg1"; //you must set this if isBackgroundWhite is false
var fillEntirePage = false; //no effect if mobileVersion is true
var mobileVersion = false;
var navbarOpacity = "0"; // 0 <= x <= 1. 0 is transparent, 1 is solid -- it defaults to 1 if isBackgroundWhite is true
var navbarColor = {r:58, g:153, b:255};
var coverColor = {r:58, g:153, b:255};
var coverTextColor = {r:255, g:255, b:255};

var pages = [
    //Link, Picture name, Active
    ["https://www.google.com", 'google.jpg', 1],
    ["https://www.facebook.com", 'facebook.jpg', 1],
    ["https://www.youtube.com", 'youtube.jpg', 1],
    ["https://www.yahoo.com", 'yahoo.jpg', 1],
    ["https://www.reddit.com", 'reddit.jpg', 1],
    ["https://www.netflix.com/browse", 'netflix.jpg', 1],
];

var backgrounds = [
    "bg1",
    "bg2",
    "bg3",
    "bg4",
    "bg5",
    "bg6",
    "bg7",
    "bg8",
    "bg9",
    "bg10",
    "bg11",
    "bg12",
    "bg13",
    "bg14",
    "bg15",
];

var clockborderbackgrounds = [
    "bg5",
    "bg8",
    "bg14",
];

var knownpages = [
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
];
