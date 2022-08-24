<script>
  export let settingsData;
  export let saveSettings;
  let unsavedSettings = false;

  const toHex = (color) => {
    let hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
    return hex;
  };

  const toRGB = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  let tileBorderColor = toHex(settingsData.tileBorderColor);
  let navbarColor = toHex(settingsData.navbarColor);
  let coverColor = toHex(settingsData.coverColor);
  let coverTextColor = toHex(settingsData.coverTextColor);
</script>

<form
  id="settingsform"
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
  <div class="settingsInput">
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

  <div class="settingsInput">
    <label for="set_isBackgroundWhite">White background</label>
    <input
      type="checkbox"
      id="set_isBackgroundWhite"
      name="set_isBackgroundWhite"
      bind:checked={settingsData.isBackgroundWhite}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
    <label for="set_showCover">Show cover</label>
    <input
      type="checkbox"
      id="set_showCover"
      name="set_showCover"
      bind:checked={settingsData.showCover}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
    <label for="set_clockBackground">Clock background</label>
    <input
      type="checkbox"
      id="set_clockBackground"
      name="set_clockBackground"
      bind:checked={settingsData.clockBackground}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
    <label for="set_tileMinimumWidth">Tile minimum width</label>
    <input
      type="number"
      min="10"
      max="300"
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

  <div class="settingsInput">
    <label for="set_tileHeight">Tile height</label>
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

  <div class="settingsInput">
    <label for="set_tileGap">Tile gap</label>
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

  <div class="settingsInput">
    <label for="set_tileBorder">Tile border</label>
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

  <div class="settingsInput">
    <label for="set_tileBorderRadius">Tile border radius</label>
    <input
      type="number"
      min="0"
      max="1000"
      step="1"
      class="settingsNumberInput"
      id="set_tileBorderRadius"
      name="set_tileBorderRadius"
      bind:value={settingsData.tileBorderRadius}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
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

  <div class="settingsInput">
    <label for="set_navbarOpacity">Navbar opacity</label>
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

  <div class="settingsInput">
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

  <div class="settingsInput">
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

  <div class="settingsInput">
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

  {#if unsavedSettings}
    <small class="unsavedWarning">You have unsaved settings.</small>
  {/if}

  <button type="submit" class="saveSettingsButton">Save</button>
</form>

<style>
  .settingsInput {
    display: flex;
    align-items: center;
    margin-top: 5px;
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
    border-radius: 10px;
    border: 1px solid gray;
  }
  .settingsNumberInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
  }
  .settingsColorInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
    cursor: pointer;
    transition: 0.3s;
  }
  .settingsColorInput:hover {
    background-color: rgb(225, 225, 225);
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
  .unsavedWarning {
    display: block;
    color: red;
    margin-top: 8px;
  }
</style>
