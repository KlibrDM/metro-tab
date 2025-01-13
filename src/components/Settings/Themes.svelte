<script>
  import { themes, tileThemes } from "../../data/config";
  import { saveConfig } from "../../data/storage";
  import { userData } from "../../store";

  export let settingsData;

  const applyTheme = (settings) => {
    userData.update((state) => {
      state.darkMode = settings.darkMode !== undefined ? settings.darkMode : state.darkMode;
      state.clockBackground = settings.clockBackground !== undefined ? settings.clockBackground : state.clockBackground;
      state.isBackgroundSolid = settings.isBackgroundSolid !== undefined ? settings.isBackgroundSolid : state.isBackgroundSolid;
      state.backgroundSolidColor = settings.backgroundSolidColor !== undefined ? settings.backgroundSolidColor : state.backgroundSolidColor;
      state.backgroundImage = settings.backgroundImage !== undefined ? settings.backgroundImage : state.backgroundImage;
      state.tileZoom = settings.tileZoom !== undefined ? settings.tileZoom : state.tileZoom;
      state.tileGrow = settings.tileGrow !== undefined ? settings.tileGrow : state.tileGrow;
      state.tileMinWidth = settings.tileMinWidth !== undefined ? settings.tileMinWidth : state.tileMinWidth;
      state.tileHeight = settings.tileHeight !== undefined ? settings.tileHeight : state.tileHeight;
      state.tileGap = settings.tileGap !== undefined ? settings.tileGap : state.tileGap;
      state.tileBorder = settings.tileBorder !== undefined ? settings.tileBorder : state.tileBorder;
      state.tileBorderRadius = settings.tileBorderRadius !== undefined ? settings.tileBorderRadius : state.tileBorderRadius;
      state.tileBorderColor = settings.tileBorderColor !== undefined ? settings.tileBorderColor : state.tileBorderColor;
      state.groupTileGap = settings.groupTileGap !== undefined ? settings.groupTileGap : state.groupTileGap;
      state.groupTileBorderRadius = settings.groupTileBorderRadius !== undefined ? settings.groupTileBorderRadius : state.groupTileBorderRadius;
      state.groupTileGrow = settings.groupTileGrow !== undefined ? settings.groupTileGrow : state.groupTileGrow;
      state.navbarOpacity = settings.navbarOpacity !== undefined ? settings.navbarOpacity : state.navbarOpacity;
      state.navbarColor = settings.navbarColor !== undefined ? settings.navbarColor : state.navbarColor;
      state.coverColor = settings.coverColor !== undefined ? settings.coverColor : state.coverColor;
      state.coverTextColor = settings.coverTextColor !== undefined ? settings.coverTextColor : state.coverTextColor;
      return state;
    });

    //Save to localstorage
    saveConfig({...settingsData, ...settings});
  }
</script>


<div id="settingsThemes">
  <h2>Themes</h2>
  <div id="themeList">
    {#each themes as theme}
      <div class="item" class:darkModifier={settingsData.darkMode}>
        <div class="themeThumbnail">
          <img src={`static/images/themes/${theme.thumbnail}.webp`} alt={`${theme.label} theme thumbnail`} />
        </div>
        <div class="themeDetails">
          <div class="themeDetailsText">
            <h3>{theme.label}</h3>

            {#if theme.changesTiles === "full"}
              <p>Changes all tile settings</p>
            {:else if theme.changesTiles === "partial"}
              <p>Changes some tile settings</p>
            {/if}

            {#if theme.changesBackground}
              <p>Changes background</p>
            {/if}

            {#if theme.changesColors}
              <p>Changes colors</p>
            {/if}

            {#if theme.changesPanelColors === "dark"}
              <p>Changes panel colors to dark</p>
            {:else if theme.changesPanelColors === "light"}
              <p>Changes panel colors to light</p>
            {:else}
              <p>Doesn't change panel colors</p>
            {/if}
          </div>
          <button
            class="itemButton"
            on:click={() => applyTheme(theme.settings)}
          >
            Apply
          </button>
        </div>
      </div>
    {/each}
  </div>

  <h2 id="tileThemeListTitle">Tile presets</h2>
  <div id="tileThemeList">
    {#each tileThemes as theme}
      <div class="item" class:darkModifier={settingsData.darkMode}>
        <div class="themeThumbnail">
          <img src={`static/images/themes/${theme.thumbnail}.webp`} alt={`${theme.label} preset thumbnail`} />
        </div>
        <div class="themeDetails">
          <div class="themeDetailsText">
            <h3>{theme.label}</h3>

            {#if theme.changesTiles === "full"}
              <p>Changes all tile settings</p>
            {:else if theme.changesTiles === "partial"}
              <p>Changes some tile settings</p>
            {/if}

            {#if theme.changesBackground}
              <p>Changes background</p>
            {/if}

            {#if theme.changesColors}
              <p>Changes colors</p>
            {/if}

            {#if theme.changesPanelColors === "dark"}
              <p>Changes panel colors to dark</p>
            {:else if theme.changesPanelColors === "light"}
              <p>Changes panel colors to light</p>
            {:else}
              <p>Doesn't change panel colors</p>
            {/if}
          </div>
          <button
            class="itemButton"
            on:click={() => applyTheme(theme.settings)}
          >
            Apply
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  #tileThemeListTitle {
    margin-block-start: 0.8em;
  }
  #themeList, #tileThemeList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    gap: 5px;
    overflow-y: auto;
  }
  .item {
    display: flex;
    gap: 12px;
    padding: 8px 8px;
    border-radius: 10px;
    border: 1px solid lightgray;
  }
  .item.darkModifier {
    border-color: #3a99ff;
  }
  .themeThumbnail {
    width: 300px;
    min-height: 145px;
  }
  .themeThumbnail img {
    width: 100%;
    vertical-align: middle;
  }
  .themeDetails {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: space-between;
  }
  .themeDetailsText h3 {
    margin: 0;
    margin-bottom: 4px;
  }
  .themeDetailsText p {
    margin: 0;
    font-size: 0.9em;
  }
  .itemButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .itemButton:hover {
    background-color: rgb(238, 195, 25);
  }
</style>
