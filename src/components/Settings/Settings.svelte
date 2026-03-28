<script>
  import { userData } from "../../store";
  import * as CONFIG from "../../data/config";
  import { saveConfig, saveBackground, saveBackgroundColor, saveSearchEngine } from "../../data/storage";
  import { checkWebsite, escapeHTML, getImageNameForLink } from "../../data/tools";
  import { v4 as uuid } from "uuid";

  import SettingsForm from "./SettingsForm.svelte";
  import Backgrounds from "./Backgrounds.svelte";
  import Pages from "./Pages.svelte";
  import ImportExport from "./ImportExport.svelte";
  import SearchEngine from "./SearchEngine.svelte";
  import About from "./About.svelte";
  import Themes from "./Themes.svelte";
  import Categories from "./Categories.svelte";
  import Bookmarks from "./Bookmarks.svelte";

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
      state.clockDateFormat = settingsData.clockDateFormat;
      state.clockPosition = settingsData.clockPosition;
      state.clockSize = settingsData.clockSize;
      state.darkMode = settingsData.darkMode;
      state.useFrostedGlass = settingsData.useFrostedGlass;
      state.frostedGlassStrength = settingsData.frostedGlassStrength;
      state.frostedGlassOpacity = settingsData.frostedGlassOpacity;
      state.frostedGlassColor = settingsData.frostedGlassColor;
      state.frostedGlassAccentColor = settingsData.frostedGlassAccentColor;
      state.showElementsShadow = settingsData.showElementsShadow;
      state.showSearchBar = settingsData.showSearchBar;
      state.searchBarWidth = settingsData.searchBarWidth;
      state.searchBarHeight = settingsData.searchBarHeight;
      state.showPageQuickAdd = settingsData.showPageQuickAdd;
      state.tileZoom = settingsData.tileZoom;
      state.tileGrow = settingsData.tileGrow;
      state.tileSafeZone = settingsData.tileSafeZone;
      state.tileMinWidth = settingsData.tileMinWidth;
      state.tileHeight = settingsData.tileHeight;
      state.tileGap = settingsData.tileGap;
      state.tileBorder = settingsData.tileBorder;
      state.tileBorderRadius = settingsData.tileBorderRadius;
      state.tileBorderColor = settingsData.tileBorderColor;
      state.groupTileGap = settingsData.groupTileGap;
      state.groupTileBorderRadius = settingsData.groupTileBorderRadius;
      state.groupTileGrow = settingsData.groupTileGrow;
      state.navbarCompact = settingsData.navbarCompact;
      state.navbarOpacity = settingsData.navbarOpacity;
      state.navbarColor = settingsData.navbarColor;
      state.coverColor = settingsData.coverColor;
      state.coverTextColor = settingsData.coverTextColor;
      state.tabName = escapeHTML(settingsData.tabName);
      state.tabIcon = settingsData.tabIcon;
      state.pages = settingsData.pages;
      state.categories = settingsData.categories;
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
      state.clockDateFormat = CONFIG.clockDateFormat;
      state.clockPosition = CONFIG.clockPosition;
      state.clockSize = CONFIG.clockSize;
      state.darkMode = CONFIG.darkMode;
      state.useFrostedGlass = CONFIG.useFrostedGlass;
      state.frostedGlassStrength = CONFIG.frostedGlassStrength;
      state.frostedGlassOpacity = CONFIG.frostedGlassOpacity;
      state.frostedGlassColor = CONFIG.frostedGlassColor;
      state.frostedGlassAccentColor = CONFIG.frostedGlassAccentColor;
      state.showElementsShadow = CONFIG.showElementsShadow;
      state.showSearchBar = CONFIG.showSearchBar;
      state.searchBarWidth = CONFIG.searchBarWidth;
      state.searchBarHeight = CONFIG.searchBarHeight;
      state.showPageQuickAdd = CONFIG.showPageQuickAdd;
      state.tileZoom = CONFIG.tileZoom;
      state.tileGrow = CONFIG.tileGrow;
      state.tileSafeZone = CONFIG.tileSafeZone;
      state.tileMinWidth = CONFIG.tileMinWidth;
      state.tileHeight = CONFIG.tileHeight;
      state.tileGap = CONFIG.tileGap;
      state.tileBorder = CONFIG.tileBorder;
      state.tileBorderRadius = CONFIG.tileBorderRadius;
      state.tileBorderColor = CONFIG.tileBorderColor;
      state.groupTileGap = CONFIG.groupTileGap;
      state.groupTileBorderRadius = CONFIG.groupTileBorderRadius;
      state.groupTileGrow = CONFIG.groupTileGrow;
      state.navbarCompact = CONFIG.navbarCompact;
      state.navbarOpacity = CONFIG.navbarOpacity;
      state.navbarColor = CONFIG.navbarColor;
      state.coverColor = CONFIG.coverColor;
      state.coverTextColor = CONFIG.coverTextColor;
      state.tabName = escapeHTML(CONFIG.tabName);
      state.tabIcon = CONFIG.tabIcon;
      return state;
    });

    //Save to localstorage
    saveConfig(settingsData);
  };

  const changeSearchEngine = (engine, customEngineUrl) => {
    userData.update((state) => {
      state.searchEngine = engine;
      state.customSearchEngineURL = customEngineUrl;
      return state;
    });

    //Save to localstorage
    saveSearchEngine(engine, customEngineUrl);
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
    let imageName = getImageNameForLink(linkToAdd);

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
    <div id="settingsNav">
      <div class="settingsNavIcon">
        <i class="fa-solid fa-gears" />
        <p>Settings</p>
      </div>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 0}
        on:click={() => {changeTab(0);}}
      >
        Pages
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 1}
        on:click={() => {changeTab(1);}}
      >
        Categories
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 2}
        on:click={() => {changeTab(2);}}
      >
        Background
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 3}
        on:click={() => {changeTab(3);}}
      >
        Visuals
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 4}
        on:click={() => {changeTab(4);}}
      >
        Themes
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 5}
        on:click={() => {changeTab(5);}}
      >
        Search Engine
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 6}
        on:click={() => {changeTab(6);}}
      >
        Bookmarks
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 7}
        on:click={() => {changeTab(7);}}
      >
        Backup
      </button>
      <button
        class="settingsNavButton"
        class:headerSelected={tabIndex === 8}
        on:click={() => {changeTab(8);}}
      >
        About
      </button>
    </div>
    <div class="settingsContentContainer">
      {#if tabIndex === 0}
        <div class="settingsContentHeader">
          <h2>Pages</h2>
        </div>
        <div class="settingsContent">
          <Pages {settingsData} {deletePage} {addPage} {saveSettings} {movePage} {createGroup} bind:unsavedPages={unsavedSettings} />
        </div>
      {:else if tabIndex === 1}
        <div class="settingsContentHeader">
          <h2>Page categories</h2>
        </div>
        <div class="settingsContent">
          <Categories {settingsData} {addCategory} {deleteCategory} {moveCategory} {saveSettings} bind:unsavedSettings={unsavedSettings} />
        </div>
      {:else if tabIndex === 2}
        <div class="settingsContentHeader">
          <h2>Background</h2>
        </div>
        <div class="settingsContent">
          <Backgrounds {changeBackground} {changeBackgroundColor} />
        </div>
      {:else if tabIndex === 3}
        <div class="settingsContentHeader">
          <h2>Visuals</h2>
        </div>
        <div class="settingsContent">
          <SettingsForm {settingsData} {saveSettings} {resetVisuals} bind:unsavedSettings={unsavedSettings} />
        </div>
      {:else if tabIndex === 4}
        <div class="settingsContentHeader">
          <h2>Themes</h2>
        </div>
        <div class="settingsContent">
          <Themes {settingsData} />
        </div>
      {:else if tabIndex === 5}
        <div class="settingsContentHeader">
          <h2>Search Engine</h2>
        </div>
        <div class="settingsContent">
          <SearchEngine {settingsData} {changeSearchEngine} />
        </div>
      {:else if tabIndex === 6}
        <div class="settingsContentHeader">
          <h2>Bookmarks</h2>
        </div>
        <div class="settingsContent">
          <Bookmarks {settingsData} {saveSettings} />
        </div>
      {:else if tabIndex === 7}
        <div class="settingsContentHeader">
          <h2>Backup</h2>
        </div>
        <div class="settingsContent">
          <ImportExport {settingsData} {saveSettings} />
        </div>
      {:else if tabIndex === 8}
        <div class="settingsContent">
          <About />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .peekOpacity {
    opacity: 0;
  }
  #settingsButton {
    position: absolute;
    top: 20px;
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
    top: 20px;
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
    position: absolute;
    background-color: var(--settings-background-color);
    right: 0;
    top: 0;
    z-index: 50;
    max-height: 100vh;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    transition: 0.4s;
  }
  #settingsPanel.darkModifier {
    background-color: var(--settings-background-color-dark);
    color: white;
  }
  .highZIndex {
    z-index: 60 !important;
  }
  #settingsNav {
    display: flex;
    flex-direction: column;
    background-color: var(--settings-background-secondary-color);
    overflow-y: auto;
    flex-shrink: 0;
    box-shadow: var(--shadow-small-subtle);
    z-index: 3;
  }
  #settingsPanel.darkModifier #settingsNav {
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsNavIcon {
    height: 72px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    font-size: 1.2em;
  }
  .settingsNavIcon i {
    font-size: 1.4em;
  }
  .settingsNavButton {
    background-color: transparent;
    border: 0;
    color: rgb(95, 95, 95);
    cursor: pointer;
    transition: 0.3s;
    font-size: 1em;
    flex-shrink: 0;
    text-align: left;
    padding: 10px 30px;
  }
  .settingsNavButton:hover {
    color: black;
  }
  .headerSelected {
    color: var(--primary-color-text);
    background-color: var(--primary-color);
  }
  .headerSelected:hover {
    color: var(--primary-color-text);
    background-color: var(--primary-color-hover);
  }
  #settingsPanel.darkModifier .settingsNavButton {
    color: white;
  }
  #settingsPanel.darkModifier .settingsNavButton:hover {
    color: rgb(200, 200, 200);
  }
  .settingsContentContainer {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .settingsContentHeader {
    padding: 20px;
    background-color: var(--settings-background-secondary-color);
    box-shadow: var(--shadow-small-subtle);
    height: 72px;
    box-sizing: border-box;
    flex-shrink: 0;
    z-index: 2;
  }
  #settingsPanel.darkModifier .settingsContentHeader {
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsContentHeader h2 {
    margin: 0;
  }
  .settingsContent {
    height: 100%;
    overflow-y: auto;
  }
  @media screen and (max-width: 599px) {
    #settingsPanel {
      flex-direction: column;
    }
    #settingsNav {
      flex-direction: row;
      margin-right: 120px;
    }
    .settingsNavButton {
      padding: 20px 12px;
    }
  }
</style>
