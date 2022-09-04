<script>
  import { toHex, toRGB } from "../../data/tools";

  export let settingsData;
  export let saveSettings;
  export let resetVisuals;
  export let unsavedSettings;

  let tileBorderColor = toHex(settingsData.tileBorderColor);
  let navbarColor = toHex(settingsData.navbarColor);
  let coverColor = toHex(settingsData.coverColor);
  let coverTextColor = toHex(settingsData.coverTextColor);
</script>

<h2>Visuals</h2>
<form
  id="settingsForm"
  on:submit={(e) => {
    //Convert colors from HEX to RGB
    settingsData.tileBorderColor = toRGB(tileBorderColor);
    settingsData.navbarColor = toRGB(navbarColor);
    settingsData.coverColor = toRGB(coverColor);
    settingsData.coverTextColor = toRGB(coverTextColor);

    saveSettings(settingsData, e);
    unsavedSettings = false;
  }}
>
  <div class="settingsFormGroup">
    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_your_name.png" alt="Set your name" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_show_cover.png" alt="Set show cover" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_clock_background.png" alt="Set clock background" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_zoom.png" alt="Set tile zoom on hover" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_fill_space.png" alt="Set tile fill space" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_minimum_width.png" alt="Set tile minimum width" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_height.png" alt="Set tile height" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_gap.png" alt="Set tile gap" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_border_radius.png" alt="Set tile border radius" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_border.png" alt="Set tile border" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_tile_border_color.png" alt="Set tile border color" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_navbar_opacity.png" alt="Set navbar opacity" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_navbar_color.png" alt="Set navbar color" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_cover_color.png" alt="Set cover color" />
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
    </div>

    <div class="settingsInput">
      <div class="imagePlaceholder">
        <img src="static/images/settings/s_cover_text_color.png" alt="Set cover text color" />
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
  #settingsForm {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .settingsFormGroup {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    overflow-y: auto;
  }
  .settingsInput {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid lightgray;
    border-radius: 15px;
    flex-grow: 1;
    max-width: 500px;
    flex-basis: 24%;
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
    color: red;
    margin-top: 8px;
  }
</style>
