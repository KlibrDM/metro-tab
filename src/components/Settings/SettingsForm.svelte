<script>
  import { toHex, toRGB } from "../../data/tools";
  import Tooltip from "../Tooltip.svelte";

  export let settingsData;
  export let saveSettings;
  export let resetVisuals;
  export let unsavedSettings;

  // Keep dark mode separate and apply only when saving
  let darkMode = settingsData.darkMode;

  let tileBorderColor = toHex(settingsData.tileBorderColor);
  let frostedGlassColor = toHex(settingsData.frostedGlassColor);
  let frostedGlassAccentColor = toHex(settingsData.frostedGlassAccentColor);
  let navbarColor = toHex(settingsData.navbarColor);
  let coverColor = toHex(settingsData.coverColor);
  let coverTextColor = toHex(settingsData.coverTextColor);

  const resetLocalVisuals = () => {
    darkMode = settingsData.darkMode;
    tileBorderColor = toHex(settingsData.tileBorderColor);
    frostedGlassColor = toHex(settingsData.frostedGlassColor);
    frostedGlassAccentColor = toHex(settingsData.frostedGlassAccentColor);
    navbarColor = toHex(settingsData.navbarColor);
    coverColor = toHex(settingsData.coverColor);
    coverTextColor = toHex(settingsData.coverTextColor);
  }
</script>

<form
  id="settingsForm"
  on:submit={(e) => {
    //Convert colors from HEX to RGB
    settingsData.tileBorderColor = toRGB(tileBorderColor);
    settingsData.frostedGlassColor = toRGB(frostedGlassColor);
    settingsData.frostedGlassAccentColor = toRGB(frostedGlassAccentColor);
    settingsData.navbarColor = toRGB(navbarColor);
    settingsData.coverColor = toRGB(coverColor);
    settingsData.coverTextColor = toRGB(coverTextColor);

    settingsData.darkMode = darkMode;

    saveSettings(settingsData, e);
    unsavedSettings = false;
  }}
>
  <div class="settingsFormContainer">
    <h2>Visuals</h2>
    <div class="settingsFormGroup" class:darkModifier={settingsData.darkMode}>
      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_your_name.webp" alt="Set your name" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_yourName">Your name</label>
          <input
            type="text"
            id="set_yourName"
            name="set_yourName"
            class="settingsTextInput"
            bind:value={settingsData.yourName}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set your name or any text you want to be displayed on the cover screen when opening a new tab.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_show_cover.webp" alt="Set show cover" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_showCover">Show cover</label>
          <input
            type="checkbox"
            id="set_showCover"
            name="set_showCover"
            class="settingsCheckbox"
            bind:checked={settingsData.showCover}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Enable or disable the cover screen (slide effect) when opening a new tab.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_clock_background.webp" alt="Set clock background" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_clockBackground">Clock background</label>
          <input
            type="checkbox"
            id="set_clockBackground"
            name="set_clockBackground"
            class="settingsCheckbox"
            bind:checked={settingsData.clockBackground}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Show a background behind the clock to improve visibility. Highly recommended on backgrounds that have low contrast with the clock text.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_clock_24_hour.webp" alt="Set 24 hour clock" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_clock24Hour">24 hour clock</label>
          <input
            type="checkbox"
            id="set_clock24Hour"
            name="set_clock24Hour"
            class="settingsCheckbox"
            bind:checked={settingsData.clock24Hour}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Toggle between 12 hour and 24 hour format for the clock.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_dark_mode.webp" alt="Set dark panels" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_darkMode">Dark panels</label>
          <input
            type="checkbox"
            id="set_darkMode"
            name="set_darkMode"
            class="settingsCheckbox"
            bind:checked={darkMode}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Toggle dark mode for menus and dialogs. The elements on the main page are not affected by this setting.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_show_elements_shadow.webp" alt="Set show shadows" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_showElementsShadow">Show shadows</label>
          <input
            type="checkbox"
            id="set_showElementsShadow"
            name="set_showElementsShadow"
            class="settingsCheckbox"
            bind:checked={settingsData.showElementsShadow}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Show or hide shadows for various elements like tiles, search bar and clock. This shadow is very subtle and it is more visible when using frosted glass design.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_show_search_bar.webp" alt="Set show search bar" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_showSearchBar">Show search bar</label>
          <input
            type="checkbox"
            id="set_showSearchBar"
            name="set_showSearchBar"
            class="settingsCheckbox"
            bind:checked={settingsData.showSearchBar}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Show or hide the search bar on the main page.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_show_page_quick_add.webp" alt="Set show page quick add" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_showPageQuickAdd">Show page quick add</label>
          <input
            type="checkbox"
            id="set_showPageQuickAdd"
            name="set_showPageQuickAdd"
            class="settingsCheckbox"
            bind:checked={settingsData.showPageQuickAdd}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Show a special tile that allows quick adding of new pages directly from the main page.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_zoom.webp" alt="Set tile zoom on hover" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileZoom">Tile zoom on hover</label>
          <input
            type="checkbox"
            id="set_tileZoom"
            name="set_tileZoom"
            class="settingsCheckbox"
            bind:checked={settingsData.tileZoom}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Enable or disable the zoom effect when hovering over tiles.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_fill_space.webp" alt="Set tile fill space" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileGrow">Tile fill space</label>
          <input
            type="checkbox"
            id="set_tileGrow"
            name="set_tileGrow"
            class="settingsCheckbox"
            bind:checked={settingsData.tileGrow}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Allow tiles to expand and fill available space in their rows. This will make tiles larger than the specified minimum width when there is extra space.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_minimum_width.webp" alt="Set tile minimum width" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileMinimumWidth">Tile minimum width</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="10"
              max="150"
              step="1"
              class="settingsSlider"
              bind:value={settingsData.tileMinWidth}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="10"
              max="150"
              step="1"
              class="settingsNumberInput"
              id="set_tileMinimumWidth"
              name="set_tileMinimumWidth"
              bind:value={settingsData.tileMinWidth}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the width of the tiles. Increasing this value will make the tiles wider. If &quot;Tile fill space&quot; is enabled, tiles will expand beyond this width to fill available space.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_height.webp" alt="Set tile height" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileHeight">Tile height</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              class="settingsSlider"
              bind:value={settingsData.tileHeight}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="5"
              max="80"
              step="1"
              class="settingsNumberInput"
              id="set_tileHeight"
              name="set_tileHeight"
              bind:value={settingsData.tileHeight}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the height of the tiles. Increasing this value will make the tiles taller.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_gap.webp" alt="Set tile gap" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileGap">Tile gap</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              class="settingsSlider"
              bind:value={settingsData.tileGap}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="30"
              step="0.1"
              class="settingsNumberInput"
              id="set_tileGap"
              name="set_tileGap"
              bind:value={settingsData.tileGap}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the space between tiles. Increasing this value will create more space between tiles.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_border_radius.webp" alt="Set tile border radius" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileBorderRadius">Tile border radius</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="80"
              step="0.1"
              class="settingsSlider"
              bind:value={settingsData.tileBorderRadius}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="80"
              step="0.1"
              class="settingsNumberInput"
              id="set_tileBorderRadius"
              name="set_tileBorderRadius"
              bind:value={settingsData.tileBorderRadius}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the border radius of the tiles. Increasing this value will make the tile corners more rounded.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_border.webp" alt="Set tile border" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileBorder">Tile border size</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              class="settingsSlider"
              bind:value={settingsData.tileBorder}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="50"
              step="1"
              class="settingsNumberInput"
              id="set_tileBorder"
              name="set_tileBorder"
              bind:value={settingsData.tileBorder}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the border size of the tiles. Increasing this value will make the tile borders thicker.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_tile_border_color.webp" alt="Set tile border color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_tileBorderColor">Tile border color</label>
          <input
            type="color"
            class="settingsColorInput"
            id="set_tileBorderColor"
            name="set_tileBorderColor"
            bind:value={tileBorderColor}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the color of the tile borders. Only visible if the tile border size is greater than 0.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_group_tile_fill_space.webp" alt="Set group tile fill space" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_groupTileGrow">Group tile fill space</label>
          <input
            type="checkbox"
            id="set_groupTileGrow"
            name="set_groupTileGrow"
            class="settingsCheckbox"
            bind:checked={settingsData.groupTileGrow}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Allow tiles in a group to expand and fill available space in their rows. Group tiles might not respect the desired aspect ratio when this setting is enabled.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_group_tile_gap.webp" alt="Set group tile gap" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_groupTileGap">Group tile gap</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              class="settingsSlider"
              bind:value={settingsData.groupTileGap}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              class="settingsNumberInput"
              id="set_groupTileGap"
              name="set_groupTileGap"
              bind:value={settingsData.groupTileGap}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the space between tiles in a group. Increasing this value will create more space between tiles in a group.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_group_tile_border_radius.webp" alt="Set group tile border radius" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_groupTileBorderRadius">Group tile border radius</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="80"
              step="0.1"
              class="settingsSlider"
              bind:value={settingsData.groupTileBorderRadius}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="80"
              step="0.1"
              class="settingsNumberInput"
              id="set_groupTileBorderRadius"
              name="set_groupTileBorderRadius"
              bind:value={settingsData.groupTileBorderRadius}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the border radius of the tiles in a group. Increasing this value will make the tile corners more rounded. Since group tiles are smaller than regular tiles, you might want to have a different border radius for them.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_navbar_opacity.webp" alt="Set navbar opacity" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_navbarOpacity">Navbar opacity</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="settingsSlider"
              bind:value={settingsData.navbarOpacity}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              class="settingsNumberInput"
              id="set_navbarOpacity"
              name="set_navbarOpacity"
              bind:value={settingsData.navbarOpacity}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the opacity of the navbar. Lower values make it more transparent, while higher values make it more opaque. 0 is fully transparent and 1 is fully opaque.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_navbar_color.webp" alt="Set navbar color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_navbarColor">Navbar color</label>
          <input
            type="color"
            class="settingsColorInput"
            id="set_navbarColor"
            name="set_navbarColor"
            bind:value={navbarColor}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the color of the navbar. Only visible if the navbar opacity is greater than 0.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_cover_color.webp" alt="Set cover color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_coverColor">Cover color</label>
          <input
            type="color"
            class="settingsColorInput"
            id="set_coverColor"
            name="set_coverColor"
            bind:value={coverColor}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the background color of the cover screen.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_cover_text_color.webp" alt="Set cover text color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_coverTextColor">Cover text color</label>
          <input
            type="color"
            class="settingsColorInput"
            id="set_coverTextColor"
            name="set_coverTextColor"
            bind:value={coverTextColor}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the color of the text on the cover screen.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>
    </div>

    
    <div class="settingsSectionTitleWithHint">
      <h2>Frosted Glass Design</h2>
      <Tooltip maxWidth="800" text="The frosted glass design adds a blur and transparency effect to various elements like tiles, search bar and clock, giving them a frosted glass appearance. This design might not be a good fit for all backgrounds. The frosted glass color, opacity and accent color might need to be adjusted to have all elements clearly visible, depending on the background used.">
        <i class="fa-solid fa-circle-info hintIcon" />
      </Tooltip>
    </div>
    <div class="settingsFormGroup" class:darkModifier={settingsData.darkMode}>
      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_use_frosted_glass.webp" alt="Set frosted glass effect" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_useFrostedGlass">Use frosted glass design</label>
          <input
            type="checkbox"
            id="set_useFrostedGlass"
            name="set_useFrostedGlass"
            class="settingsCheckbox"
            bind:checked={settingsData.useFrostedGlass}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Toggle the frosted glass design for various elements like tiles, search bar and clock. This design adds a blur and transparency effect to these elements, giving them a frosted glass appearance.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_frosted_glass_strength.webp" alt="Set frosted glass strength" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_frostedGlassStrength">Frosted glass strength</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              class="settingsSlider"
              bind:value={settingsData.frostedGlassStrength}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="30"
              step="1"
              class="settingsNumberInput"
              id="set_frostedGlassStrength"
              name="set_frostedGlassStrength"
              bind:value={settingsData.frostedGlassStrength}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the strength of the frosted glass effect. Increasing this value will make the frosted glass effect more pronounced by increasing the blur amount. There is no blur at 0.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_frosted_glass_opacity.webp" alt="Set frosted glass opacity" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_frostedGlassOpacity">Frosted glass opacity</label>
          <div class="settingsNumberSliderGroup">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="settingsSlider"
              bind:value={settingsData.frostedGlassOpacity}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              class="settingsNumberInput"
              id="set_frostedGlassOpacity"
              name="set_frostedGlassOpacity"
              bind:value={settingsData.frostedGlassOpacity}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the tile opacity when using the frosted glass design. Lower values make the tiles more transparent, while higher values make the tiles more opaque.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_frosted_glass_color.webp" alt="Set frosted glass color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_frostedGlassColor">Frosted glass color</label>
          <div class="settingsColorGroup">
            <div class="settingsColorQuickSelectContainer">
              <button
                type="button"
                class="settingsColorQuickSelectButton"
                style="background-color: #ffffff;"
                on:click={() => {
                  frostedGlassColor = "#ffffff";
                  unsavedSettings = true;
                }}
              />
              <button
                type="button"
                class="settingsColorQuickSelectButton"
                style="background-color: #7d7d7d;"
                on:click={() => {
                  frostedGlassColor = "#7d7d7d";
                  unsavedSettings = true;
                }}
              />
              <button
                type="button"
                class="settingsColorQuickSelectButton"
                style="background-color: #000000;"
                on:click={() => {
                  frostedGlassColor = "#000000";
                  unsavedSettings = true;
                }}
              />
            </div>
            <input
              type="color"
              class="settingsColorInput"
              id="set_frostedGlassColor"
              name="set_frostedGlassColor"
              bind:value={frostedGlassColor}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
          
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the background color of the tiles when using the frosted glass design.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/s_frosted_glass_accent_color.webp" alt="Set frosted glass accent color" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_frostedGlassAccentColor">Frosted glass accent color</label>
          <div class="settingsColorGroup">
            <div class="settingsColorQuickSelectContainer">
              <button
                type="button"
                class="settingsColorQuickSelectButton"
                style="background-color: #ffffff;"
                on:click={() => {
                  frostedGlassAccentColor = "#ffffff";
                  unsavedSettings = true;
                }}
              />
              <button
                type="button"
                class="settingsColorQuickSelectButton"
                style="background-color: #000000;"
                on:click={() => {
                  frostedGlassAccentColor = "#000000";
                  unsavedSettings = true;
                }}
              />
            </div>
            <input
              type="color"
              class="settingsColorInput"
              id="set_frostedGlassAccentColor"
              name="set_frostedGlassAccentColor"
              bind:value={frostedGlassAccentColor}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Set the accent color for icons and text when using the frosted glass design.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>

  <div class="settingBottomSection">
    <div class="settingsButtonWithError">
      <button type="submit" class="saveSettingsButton">Save</button>

      {#if unsavedSettings}
        <small class="unsavedWarning">You have unsaved settings.</small>
      {/if}
    </div>

    <div class="settingsResetButton">
      <button
        type="button"
        class="resetSettingsButton"
        on:click={() => {
          resetVisuals();
          resetLocalVisuals();
          unsavedSettings = false;
        }}
      >
        Reset to default settings
      </button>
    </div>
  </div>
</form>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  hr {
    width: 90%;
    border: 0;
    border-top: 1px solid lightgray;
  }
  .settingsFormGroup.darkModifier hr {
    border-color: #3a99ff;
  }
  #settingsForm {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .settingsFormContainer {
    overflow-y: auto;
    padding-right: 8px;
  }
  .settingsFormGroup {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }
  .settingsInput {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid lightgray;
    border-radius: 15px;
    position: relative;
  }
  .settingsFormGroup.darkModifier .settingsInput {
    border-color: #3a99ff;
  }
  .settingsFormHintContainer {
    position: absolute;
    top: 6px;
    right: 8px;
  }
  .hintIcon {
    color: #3a99ff;
  }
  .settingsSectionTitleWithHint {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .imagePlaceholder {
    width: 250px;
    min-height: 125px;
  }
  .settingsInput img {
    width: 250px;
    display: block;
  }
  .settingsInputGroup {
    display: flex;
    justify-content: space-between;
    padding: 0px 15px 10px 15px;
    width: calc(100% - 30px);
  }
  .settingsInput label {
    margin-right: 10px;
    margin-bottom: 0;
  }
  .settingsInput input:out-of-range {
    background-color: rgba(255, 0, 0, 0.15);
  }
  .settingsTextInput {
    padding: 3px 5px;
    border-radius: 5px;
    border: 1px solid gray;
    max-width: 120px;
  }
  .settingsNumberInput {
    padding: 3px 5px;
    border-radius: 5px;
    border: 1px solid gray;
    width: 40px;
  }
  .settingsNumberSliderGroup {
    display: flex;
    flex-grow: 1;
    gap: 5px;
  }
  .settingsSlider {
    width: 50px;
    flex-grow: 1;
  }
  .settingsSlider::-webkit-slider-thumb {
    cursor: pointer;
  }
  .settingsColorGroup {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .settingsColorQuickSelectContainer {
    display: flex;
    gap: 5px;
  }
  .settingsColorQuickSelectButton {
    width: 16px;
    height: 16px;
    padding: 0;
    border: 1px solid gray;
    border-radius: 32px;
    cursor: pointer;
  }
  .settingsCheckbox {
    width: 18px;
    height: 18px;
  }
  .settingsColorInput {
    padding: 1px 3px;
    border-radius: 5px;
    border: 1px solid gray;
    cursor: pointer;
    transition: 0.3s;
  }
  .settingsColorInput:hover {
    background-color: rgb(225, 225, 225);
  }
  .settingBottomSection{
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .settingsButtonWithError {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .saveSettingsButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .saveSettingsButton:hover {
    background-color: #0c2;
  }
  .resetSettingsButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: #000;
    background-color: #fff;
    transition: 0.3s;
  }
  .resetSettingsButton:hover {
    background-color: #f3f3f3;
  }
  .unsavedWarning {
    display: block;
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: red;
    line-height: 1rem;
    padding: 6px 12px;
    border-radius: 8px;
    margin-top: 8px;
    animation: shake-bottom 4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both infinite;
    animation-delay: 2s;
  }
</style>
