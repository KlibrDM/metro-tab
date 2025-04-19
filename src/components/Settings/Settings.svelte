<script>
  import { userData } from "../../store";
  import * as CONFIG from "../../data/config";
  import { saveConfig, saveBackground, saveBackgroundColor, saveSearchEngine } from "../../data/storage";
  import { v4 as uuid } from "uuid";

  import SettingsForm from "./SettingsForm.svelte";
  import Backgrounds from "./Backgrounds.svelte";
  import Pages from "./Pages.svelte";
  import ImportExport from "./ImportExport.svelte";
  import SearchEngine from "./SearchEngine.svelte";
  import About from "./About.svelte";
  import Themes from "./Themes.svelte";
  import Categories from "./Categories.svelte";

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
      state.clock24Hour = settingsData.clock24Hour;
      state.darkMode = settingsData.darkMode;
      state.tileZoom = settingsData.tileZoom;
      state.tileGrow = settingsData.tileGrow;
      state.tileMinWidth = settingsData.tileMinWidth;
      state.tileHeight = settingsData.tileHeight;
      state.tileGap = settingsData.tileGap;
      state.tileBorder = settingsData.tileBorder;
      state.tileBorderRadius = settingsData.tileBorderRadius;
      state.tileBorderColor = settingsData.tileBorderColor;
      state.groupTileGap = settingsData.groupTileGap;
      state.groupTileBorderRadius = settingsData.groupTileBorderRadius;
      state.groupTileGrow = settingsData.groupTileGrow;
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
      state.clock24Hour = CONFIG.clock24Hour;
      state.darkMode = CONFIG.darkMode;
      state.tileZoom = CONFIG.tileZoom;
      state.tileGrow = CONFIG.tileGrow;
      state.tileMinWidth = CONFIG.tileMinWidth;
      state.tileHeight = CONFIG.tileHeight;
      state.tileGap = CONFIG.tileGap;
      state.tileBorder = CONFIG.tileBorder;
      state.tileBorderRadius = CONFIG.tileBorderRadius;
      state.tileBorderColor = CONFIG.tileBorderColor;
      state.groupTileGap = CONFIG.groupTileGap;
      state.groupTileBorderRadius = CONFIG.groupTileBorderRadius;
      state.groupTileGrow = CONFIG.groupTileGrow;
      state.navbarOpacity = CONFIG.navbarOpacity;
      state.navbarColor = CONFIG.navbarColor;
      state.coverColor = CONFIG.coverColor;
      state.coverTextColor = CONFIG.coverTextColor;
      return state;
    });

    //Save to localstorage
    saveConfig(settingsData);
  };

  const changeSearchEngine = (engine) => {
    userData.update((state) => {
      state.searchEngine = engine;
      return state;
    });

    //Save to localstorage
    saveSearchEngine(engine);
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

  const addCategory = (addCategoryInput, event) => {
    event.preventDefault();

    //Add category to the list
    settingsData.categories.push({
      id: uuid(),
      name: addCategoryInput
    });

    //Trigger list re-render
    settingsData.categories = settingsData.categories;
  };

  const deleteCategory = (index) => {
    //Delete 1 element from specified index
    settingsData.categories.splice(index, 1);

    //Trigger list re-render
    settingsData.categories = settingsData.categories;
  };

  const moveCategory = (index, direction) => {
    const list = settingsData.categories;

    //Return if the move is not possible
    if (direction === "up" && index === 0) {
      return;
    }
    if (direction === "down" && index === list.length - 1) {
      return;
    }

    //Get current item
    let item = list[index];

    //Remove current item from old location
    list.splice(index, 1);

    //Add current item in the direction
    if (direction === "up") {
      list.splice(index - 1, 0, item);
    } else if (direction === "down") {
      list.splice(index + 1, 0, item);
    }

    //Trigger list re-render
    settingsData.categories = settingsData.categories;
  };

  const createGroup = () => {
    settingsData.pages.push({
      name: "New Group",
      isGroup: true,
      isActive: true,
      pages: [],
    });

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  }

  const addPage = (list, addPageInput, event) => {
    event.preventDefault();

    //Will add http:// if user didn't already do it
    let linkToAdd = checkWebsite(addPageInput);
    let imageName = getImageNameFor(linkToAdd);

    //Update pages state
    list.push({
      link: escapeHTML(linkToAdd),
      imageName: imageName,
      isActive: true,
      tileImageType: imageName.length > 1 ? 'predefined' : 'none',
      tileName: imageName[0].toUpperCase() + imageName.slice(1),
      backgroundColor: "#3a99ff",
      textColor: "#ffffff"
    });

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  };

  const deletePage = (list, index) => {
    //Delete 1 element from specified index
    list.splice(index, 1);

    //Trigger list re-render
    settingsData.pages = settingsData.pages;
  };

  const movePage = (list, index, direction) => {
    //Return if the move is not possible
    if (direction === "up" && index === 0) {
      return;
    }
    if (direction === "down" && index === list.length - 1) {
      return;
    }

    //Get current item
    let item = list[index];

    //Remove current item from old location
    list.splice(index, 1);

    //Add current item in the direction
    if (direction === "up") {
      list.splice(index - 1, 0, item);
    } else if (direction === "down") {
      list.splice(index + 1, 0, item);
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

  function escapeHTML(string) {
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
    class:darkModifier={settingsData.darkMode}
  >
    <i class="fas fa-eye" />
  </button>
{/if}

<button
  on:click={toggleSettingsPanel}
  id="settingsButton"
  aria-label="Settings"
  class:highZIndex={isPanelShown}
  class:darkModifier={settingsData.darkMode}
  class:unsavedButtonWarning={unsavedSettings}
  data-tooltip={unsavedSettings ? "You have unsaved settings" : undefined}
>
  <i class="fas fa-sliders-h" />
</button>

{#if isPanelShown}
  <div id="settingsPanel" transition:slide class:peekOpacity={isPeekPressed} class:darkModifier={settingsData.darkMode}>
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
        Categories
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 2}
        on:click={() => {changeTab(2);}}
      >
        Background
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 3}
        on:click={() => {changeTab(3);}}
      >
        Visuals
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 4}
        on:click={() => {changeTab(4);}}
      >
        Themes
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 5}
        on:click={() => {changeTab(5);}}
      >
        Search Engine
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 6}
        on:click={() => {changeTab(6);}}
      >
        Import/Export
      </button>
      <button
        class="settingsHeaderButton"
        class:headerSelected={tabIndex === 7}
        on:click={() => {changeTab(7);}}
      >
        About
      </button>
    </div>
    <hr/>
    <div id="settingsContent">
      {#if tabIndex === 0}
        <Pages {settingsData} {deletePage} {addPage} {saveSettings} {movePage} {createGroup} {getImageNameFor} {checkWebsite} {escapeHTML} bind:unsavedPages={unsavedSettings} />
      {:else if tabIndex === 1}
        <Categories {settingsData} {addCategory} {deleteCategory} {moveCategory} {saveSettings} bind:unsavedSettings={unsavedSettings} />
      {:else if tabIndex === 2}
        <Backgrounds {changeBackground} {changeBackgroundColor} />
      {:else if tabIndex === 3}
        <SettingsForm {settingsData} {saveSettings} {resetVisuals} bind:unsavedSettings={unsavedSettings} />
      {:else if tabIndex === 4}
        <Themes {settingsData} />
      {:else if tabIndex === 5}
        <SearchEngine currentSearchEngine={settingsData.searchEngine} {changeSearchEngine} darkMode={settingsData.darkMode} />
      {:else if tabIndex === 6}
        <ImportExport {settingsData} {saveSettings} />
      {:else if tabIndex === 7}
        <About />
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
  #settingsButton.darkModifier.highZIndex {
    background-color: rgba(255, 255, 255, 0.75);
    color: black;
  }
  #settingsButton.darkModifier.highZIndex:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
  #settingsButton.unsavedButtonWarning {
    box-shadow: 0px 0px 10px rgba(255, 0, 0, 1);
  }
  #settingsButton.unsavedButtonWarning[data-tooltip]:hover::after {
    display: block;
    position: absolute;
    top: 40px;
    right: 0;
    width: max-content;
    content: attr(data-tooltip);
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: red;
    line-height: 1rem;
    padding: 6px 12px;
    border-radius: 8px;
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
  #peekButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  #peekButton.darkModifier.highZIndex {
    background-color: rgba(255, 255, 255, 0.75);
    color: black;
  }
  #peekButton.darkModifier.highZIndex:hover {
    background-color: rgba(255, 255, 255, 0.85);
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
    transition: 0.4s;
  }
  #settingsPanel.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
  }
  .highZIndex {
    z-index: 60 !important;
  }
  #settingsHeader {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    margin-right: 64px;
  }
  .settingsHeaderButton {
    background-color: transparent;
    border: 0;
    color: rgb(95, 95, 95);
    cursor: pointer;
    transition: 0.3s;
    font-size: 1em;
    flex-shrink: 0;
  }
  .settingsHeaderButton:hover {
    color: black;
  }
  .headerSelected {
    color: rgb(58, 153, 255) !important;
  }
  .headerSelected:hover {
    color: rgb(58, 153, 255) !important;
  }
  #settingsPanel.darkModifier .settingsHeaderButton {
    color: white;
  }
  #settingsPanel.darkModifier .settingsHeaderButton:hover {
    color: rgb(200, 200, 200);
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
    #settingsHeader {
      margin-right: 84px;
    }
  }
  @media screen and (max-width: 960px) {
    #settingsHeader {
      padding-bottom: 4px;
    }
  }
</style>
