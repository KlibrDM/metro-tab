<script>
  import { userData } from "../../store";
  import * as CONFIG from "../../data/config";
  import { saveConfig, saveBackground, saveBackgroundColor } from "../../data/storage";

  import SettingsForm from "./SettingsForm.svelte";
  import Backgrounds from "./Backgrounds.svelte";
  import Pages from "./Pages.svelte";
  import ImportExport from "./ImportExport.svelte";

  let settingsData = {}; //Local data for settings
  let unsavedSettings = false;
  let isPanelShown = false;
  let isPeekPressed = false;
  let tabIndex = 0;

  const toggleSettingsPanel = () => {
    isPanelShown = !isPanelShown;
  };

  const changeTab = (index) => {
    tabIndex = index;
  }

  //Subscribe to the entire userData
  userData.subscribe((data) => {
    settingsData = data;
  });

  const saveSettings = (settingsData, event) => {
    if (event) {
      event.preventDefault();
    }

    //Update state
    userData.update((state) => {
      state.yourName = escapeHTML(settingsData.yourName);
      state.showCover = settingsData.showCover;
      state.clockBackground = settingsData.clockBackground;
      state.tileZoom = settingsData.tileZoom;
      state.tileGrow = settingsData.tileGrow;
      state.tileMinWidth = settingsData.tileMinWidth;
      state.tileHeight = settingsData.tileHeight;
      state.tileGap = settingsData.tileGap;
      state.tileBorder = settingsData.tileBorder;
      state.tileBorderRadius = settingsData.tileBorderRadius;
      state.tileBorderColor = settingsData.tileBorderColor;
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

  const resetVisuals = () => {
    //Update state
    userData.update((state) => {
      state.yourName = escapeHTML(CONFIG.yourName);
      state.showCover = CONFIG.showCover;
      state.clockBackground = CONFIG.clockBackground;
      state.tileZoom = CONFIG.tileZoom;
      state.tileGrow = CONFIG.tileGrow;
      state.tileMinWidth = CONFIG.tileMinWidth;
      state.tileHeight = CONFIG.tileHeight;
      state.tileGap = CONFIG.tileGap;
      state.tileBorder = CONFIG.tileBorder;
      state.tileBorderRadius = CONFIG.tileBorderRadius;
      state.tileBorderColor = CONFIG.tileBorderColor;
      state.navbarOpacity = CONFIG.navbarOpacity;
      state.navbarColor = CONFIG.navbarColor;
      state.coverColor = CONFIG.coverColor;
      state.coverTextColor = CONFIG.coverTextColor;
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
        state.isBackgroundSolid = false;
        return state;
      });
    } catch {
      alert(
        "Background image is too large and it couldn't be saved\n\nPlease resize/compress the image and try again"
      );
    }
  };

  const changeBackgroundColor = (color) => {
    settingsData.backgroundSolidColor = color;

    saveBackgroundColor(settingsData.backgroundSolidColor);

    userData.update((state) => {
      state.backgroundSolidColor = color;
      state.isBackgroundSolid = true;
      return state;
    });
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

  const movePage = (index, direction) => {
    //Return if the move is not possible
    if (direction === "up" && index === 0) {
      return;
    }
    if (direction === "down" && index === settingsData.pages.length - 1) {
      return;
    }

    //Get current item
    let item = settingsData.pages[index];

    //Remove current item from old location
    settingsData.pages.splice(index, 1);

    //Add current item in the direction
    if (direction === "up") {
      settingsData.pages.splice(index - 1, 0, item);
    } else if (direction === "down") {
      settingsData.pages.splice(index + 1, 0, item);
    }

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  };

  const checkWebsite = (pageName) => {
    if (pageName.substring(0, 4) === "http") {
      return pageName;
    } else {
      return "http://" + pageName;
    }
  };

  const getImageNameFor = (link) => {
    //Get page name from provided link
    let name = extractWebsiteName(link).toLowerCase();

    if (CONFIG.knownPages.includes(name)) {
      //Return the image name if the extension has it
      return name;
    } else if ("1234567890qwertyuiopasdfghjklzxcvbnm".includes(name[0])) {
      //Return the image for the first letter
      return name[0];
    } else {
      return "_";
    }
  };

  const extractWebsiteName = (link) => {
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

  //Transition
  function slide() {
    return {
      duration: 500,
      css: (t, u) => `clip-path: circle(${t * 130}% at 97.5% 3.5vh)`,
    };
  }
</script>

{#if isPanelShown}
  <button
    on:mousedown={() => {isPeekPressed = true}}
    on:mouseup={() => {isPeekPressed = false}}
    on:mouseleave={() => {isPeekPressed = false}}
    class="highZIndex"
    id="peekButton"
    aria-label="Peek behind"
  >
    <i class="fas fa-eye" />
  </button>
{/if}

<button
  on:click={toggleSettingsPanel}
  id="settingsButton"
  aria-label="Settings"
  class:highZIndex={isPanelShown}
>
  <i class="fas fa-sliders-h" />
</button>

{#if isPanelShown}
  <div id="settingsPanel" transition:slide class:peekOpacity={isPeekPressed}>
    <div id="settingsHeader">
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 0}
        on:click={() => {changeTab(0);}}
      >
        Pages
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 1}
        on:click={() => {changeTab(1);}}
      >
        Background
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 2}
        on:click={() => {changeTab(2);}}
      >
        Visuals
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 3}
        on:click={() => {changeTab(3);}}
      >
        Import/Export
      </button>
    </div>
    <hr/>
    <div id="settingsContent">
      {#if tabIndex === 0}
        <Pages {settingsData} {deletePage} {addPage} {saveSettings} {movePage} bind:unsavedPages={unsavedSettings} />
      {:else if tabIndex === 1}
        <Backgrounds {changeBackground} {changeBackgroundColor} />
      {:else if tabIndex === 2}
        <SettingsForm {settingsData} {saveSettings} {resetVisuals} bind:unsavedSettings={unsavedSettings} />
      {:else if tabIndex === 3}
        <ImportExport {settingsData} {saveSettings} />
      {/if}
    </div>
  </div>
{/if}

<style>
  hr {
    margin-block-start: 0.9em;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  .peekOpacity {
    opacity: 0;
  }
  #settingsButton {
    position: absolute;
    top: 2vh;
    right: 25px;
    width: 30px;
    height: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
    z-index: 24;
  }
  #settingsButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  #peekButton {
    position: absolute;
    top: 2vh;
    right: 65px;
    width: 30px;
    height: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
  }
  #settingsPanel {
    padding: 20px 40px;
    position: absolute;
    background-color: white;
    right: 0;
    top: 0;
    z-index: 50;
    max-height: 100vh;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .highZIndex {
    z-index: 60 !important;
  }
  #settingsHeader {
    display: flex;
    gap: 15px;
    overflow-x: auto;
  }
  .settingsHeaderButton {
    background-color: transparent;
    border: 0;
    color: rgb(95, 95, 95);
    cursor: pointer;
    transition: 0.3s;
    font-size: 1em;
  }
  .settingsHeaderButton:hover {
    color: black;
  }
  .headerSelected {
    color: rgb(58, 153, 255);
  }
  .headerSelected:hover {
    color: rgb(58, 153, 255);
  }
  #settingsContent {
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 450px) {
    #settingsPanel {
      padding: 20px;
    }
  }
</style>
