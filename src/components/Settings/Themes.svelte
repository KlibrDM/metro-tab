<script>
  import { frostedGlassThemes, themes, tileThemes } from "../../data/config";
  import { saveConfig } from "../../data/storage";
  import { userData } from "../../store";
  import ThemeItem from "./ThemeItem.svelte";

  export let settingsData;

  const applyTheme = (settings) => {
    userData.update((state) => {
      state.darkMode = settings.darkMode !== undefined ? settings.darkMode : state.darkMode;
      state.useFrostedGlass = settings.useFrostedGlass !== undefined ? settings.useFrostedGlass : state.useFrostedGlass;
      state.frostedGlassStrength = settings.frostedGlassStrength !== undefined ? settings.frostedGlassStrength : state.frostedGlassStrength;
      state.frostedGlassOpacity = settings.frostedGlassOpacity !== undefined ? settings.frostedGlassOpacity : state.frostedGlassOpacity;
      state.frostedGlassColor = settings.frostedGlassColor !== undefined ? settings.frostedGlassColor : state.frostedGlassColor;
      state.frostedGlassAccentColor = settings.frostedGlassAccentColor !== undefined ? settings.frostedGlassAccentColor : state.frostedGlassAccentColor;
      state.showElementsShadow = settings.showElementsShadow !== undefined ? settings.showElementsShadow : state.showElementsShadow;
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
      <ThemeItem
        darkMode={settingsData.darkMode}
        {theme}
        {applyTheme}
      />
    {/each}
  </div>

  <h2 id="frostedThemeListTitle">Frosted Glass Themes</h2>
  <div id="frostedThemeList">
    {#each frostedGlassThemes as theme}
      <ThemeItem
        darkMode={settingsData.darkMode}
        {theme}
        {applyTheme}
      />
    {/each}
  </div>

  <h2 id="tileThemeListTitle">Tile presets</h2>
  <div id="tileThemeList">
    {#each tileThemes as theme}
      <ThemeItem
        darkMode={settingsData.darkMode}
        {theme}
        {applyTheme}
      />
    {/each}
  </div>
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  #tileThemeListTitle, #frostedThemeListTitle {
    margin-block-start: 0.8em;
  }
  #themeList, #tileThemeList, #frostedThemeList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    gap: 5px;
    overflow-y: auto;
    padding-right: 8px;
  }
</style>
