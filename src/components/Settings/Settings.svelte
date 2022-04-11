<script>
  import { userData } from "../../store";
  import { backgrounds, knownPages } from "../../data/config";
  import { saveConfig, saveBackground } from "../../data/storage";

  import SettingsForm from "./SettingsForm.svelte";
  import Backgrounds from "./Backgrounds.svelte";
  import Pages from "./Pages.svelte";

  let settingsData = {}; //Local data for settings
  let isPanelShown = false;

  const toggleSettingsPanel = () => {
    isPanelShown = !isPanelShown;
  };

  //Subscribe to the entire userData
  userData.subscribe((data) => {
    settingsData = data;
  });

  const saveSettings = (settingsData, event) => {
    event.preventDefault();

    //Update state
    userData.update((state) => {
      state.yourName = escapeHTML(settingsData.yourName);
      state.isBackgroundWhite = settingsData.isBackgroundWhite;
      state.showCover = settingsData.showCover;
      state.clockBackground = settingsData.clockBackground;
      state.tileMinWidth = settingsData.tileMinWidth;
      state.tileHeight = settingsData.tileHeight;
      state.tileGap = settingsData.tileGap;
      state.navbarOpacity = settingsData.navbarOpacity;
      state.navbarColor = settingsData.navbarColor;
      state.coverColor = settingsData.coverColor;
      state.coverTextColor = settingsData.coverTextColor;
      state.pages = settingsData.pages;
      return state;
    });

    //Save to localstorage
    saveConfig(settingsData);
  };

  const changeBackground = (bg) => {
    settingsData.backgroundImage = bg;

    try {
      //Try saving to local storage if it doesn't exceed max size
      saveBackground(settingsData.backgroundImage);

      //Update background state IF it didn't fail saving to localstorage
      userData.update((state) => {
        state.backgroundImage = settingsData.backgroundImage;
        return state;
      });
    } catch {
      alert(
        "Background image is too large and it couldn't be saved\n\nPlease resize/compress the image and try again"
      );
    }
  };

  const addPage = (addPageInput, event) => {
    event.preventDefault();

    //Will add http:// if user didn't already do it
    let linkToAdd = checkWebsite(addPageInput);

    //Update pages state
    settingsData.pages.push({
      link: escapeHTML(linkToAdd),
      imageName: getImageNameFor(linkToAdd),
      isActive: true,
    });

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  };

  const deletePage = (index) => {
    //Delete 1 element from specified index
    settingsData.pages.splice(index, 1);

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  };

  const checkWebsite = (pageName) => {
    if (pageName.substring(0, 4) == "http") {
      return pageName;
    } else {
      return "http://" + pageName;
    }
  };

  const getImageNameFor = (link) => {
    //Get page name from provided link
    let name = extractWebsiteName(link).toLowerCase();

    if (knownPages.includes(name)) {
      //Return the image name if the extension has it
      return name + ".jpg";
    } else {
      //Return the image for the first letter
      return name[0] + ".jpg";
    }
  };

  const extractWebsiteName = (link) => {
    let sitename = link;

    //Remove http(s)://
    sitename = sitename.substring(sitename.indexOf("://") + 3);

    //Remove www. if existent
    if (sitename.substring(0, 3) == "www") {
      sitename = sitename.substring(4);
    }

    //Remove ending (.com etc) (if found)
    if (sitename.lastIndexOf(".") != -1) {
      sitename = sitename.substring(0, sitename.lastIndexOf("."));
    }

    //Do it twice for those that have .co
    if (sitename.slice(-3) == ".co") {
      sitename = sitename.substring(0, sitename.lastIndexOf("."));
    }

    return sitename;
  };

  let entityMap = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#x60;",
  };
  function escapeHTML(string) {
    return String(string).replace(/[<>"'`]/g, function (s) {
      return entityMap[s];
    });
  }
</script>

<button on:click={toggleSettingsPanel} id="settingsButton">
  <i class="fas fa-sliders-h" />
</button>

{#if isPanelShown}
  <div id="settingsPanel">
    <h2>Settings</h2>
    <SettingsForm {settingsData} {saveSettings} />
    <hr />
    <h2>Background</h2>
    <Backgrounds {backgrounds} {changeBackground} />
    <hr />
    <h2>Pages</h2>
    <Pages {settingsData} {deletePage} {addPage} {saveSettings} />
  </div>
{/if}

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  hr {
    margin-block-start: 0.9em;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-left: 8px;
    margin-right: 8px;
  }
  #settingsButton {
    position: absolute;
    top: 2vh;
    right: 2vw;
    width: 30px;
    height: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(60, 60, 60, 0.5);
    border-radius: 100%;
    border: 0;
    cursor: pointer;
    z-index: 5;
  }
  #settingsPanel {
    padding: 20px 40px;
    position: absolute;
    background-color: white;
    right: 0;
    top: 0;
    z-index: 3;
    max-height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
  }
</style>
