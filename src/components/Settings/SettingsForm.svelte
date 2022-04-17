<script>
  export let settingsData;
  export let saveSettings;
  let unsavedSettings = false;
</script>

<form
  id="settingsform"
  on:submit={(e) => {
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
    <label for="">Navbar color</label>
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_navbarColorR"
      name="set_navbarColorR"
      style="border: 1px solid #fc4343;"
      bind:value={settingsData.navbarColor.r}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_navbarColorG"
      name="set_navbarColorG"
      style="border: 1px solid #24b143;"
      bind:value={settingsData.navbarColor.g}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_navbarColorB"
      name="set_navbarColorB"
      style="border: 1px solid #4286f4;"
      bind:value={settingsData.navbarColor.b}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
    <label for="">Cover color</label>
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverColorR"
      name="set_coverColorR"
      style="border: 1px solid #fc4343;"
      bind:value={settingsData.coverColor.r}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverColorG"
      name="set_coverColorG"
      style="border: 1px solid #24b143;"
      bind:value={settingsData.coverColor.g}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverColorB"
      name="set_coverColorB"
      style="border: 1px solid #4286f4;"
      bind:value={settingsData.coverColor.b}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
  </div>

  <div class="settingsInput">
    <label for="">Cover text color</label>
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverTextColorR"
      name="set_coverTextColorR"
      style="border: 1px solid #fc4343;"
      bind:value={settingsData.coverTextColor.r}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverTextColorG"
      name="set_coverTextColorG"
      style="border: 1px solid #24b143;"
      bind:value={settingsData.coverTextColor.g}
      on:input={() => {
        unsavedSettings = true;
      }}
    />
    <input
      type="number"
      min="0"
      max="255"
      class="settingsMultiNumberInput"
      id="set_coverTextColorB"
      name="set_coverTextColorB"
      style="border: 1px solid #4286f4;"
      bind:value={settingsData.coverTextColor.b}
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
  .settingsMultiNumberInput {
    width: 50px;
    margin-right: 1px;
    padding: 2px 4px;
    border-radius: 10px;
    outline: none;
  }
  .saveSettingsButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
  }
  .unsavedWarning {
    display: block;
    color: red;
    margin-top: 8px;
  }
  @media screen and (max-width: 450px) {
    .settingsMultiNumberInput {
      width: 40px;
    }
  }
</style>
