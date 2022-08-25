<script>
  import { userData } from "../../store";
  import CustomBackgrounds from "./CustomBackgrounds.svelte";

  export let backgrounds;
  export let changeBackground;
  export let changeBackgroundColor;

  let backgroundImage;
  let savedBackgroundSolidColor;
  let newBackgroundSolidColor;
  let isBackgroundSolid;
  let backgroundSolidColorChanged = false;

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    savedBackgroundSolidColor = data.backgroundSolidColor;
    newBackgroundSolidColor = data.backgroundSolidColor;
    isBackgroundSolid = data.isBackgroundSolid;
  });

  $: backgroundImageUrl = "static/images/bg/" + backgroundImage + ".jpg";
</script>

<h2>Background</h2>
<div id="currentBackgroundImageContainer">
  <h4>Current background image</h4>
  <div
    id="currentBackgroundImage"
    style={ isBackgroundSolid
    ? "border: 1px solid lightgray; background-color: " + savedBackgroundSolidColor + ";"
    : "" }
  >
    {#if !isBackgroundSolid}
    <img
      src="{backgroundImage.length > 5 ? backgroundImage : backgroundImageUrl}"
      alt="Current background"
    />
    {/if}
  </div>
</div>

<div id="customBackgroundsContainer">
  <CustomBackgrounds {changeBackground} />
  <div>
    <h4>Custom background color</h4>
    <div id="customBackgroundColorGroup">
      <input
        type="color"
        class="settingsBackgroundColorInput"
        id="set_backgroundColor"
        name="set_backgroundColor"
        bind:value={newBackgroundSolidColor}
        on:input={() => {
          backgroundSolidColorChanged = true;
        }}
      />
      {#if backgroundSolidColorChanged || !isBackgroundSolid}
        <button
          class="settingsBackgroundColorButton"
          on:click={() => {
            backgroundSolidColorChanged = false;
            changeBackgroundColor(newBackgroundSolidColor);
          }}>
          Apply
        </button>
      {/if}
    </div>
  </div>
</div>

<h4>Gallery</h4>
<small>
  Background images provided by <a href="https://pixabay.com/">Pixabay</a>
</small>
<div id="settingsBackgrounds">
  {#each backgrounds as bg, index}
    <div class="backgroundImageSelectorPlaceholder">
      <img
        src="static/images/bg/thumbnails/{bg}.jpg"
        alt="Background {index}"
        class="backgroundImageSelector"
        on:click={() => changeBackground(bg)}
      />
    </div>
  {/each}
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  h4 {
    margin-block-start: 0.8em;
    margin-block-end: 0.2em;
  }
  #currentBackgroundImageContainer img {
    width: 100%;
    border-radius: 5px;
    display: block;
  }
  #currentBackgroundImage {
    width: 200px;
    min-height: 125px;
    border-radius: 5px;
    box-sizing: border-box;
  }
  #customBackgroundsContainer {
    display: flex;
    gap: 5vw;
  }
  #customBackgroundColorGroup {
    display: flex;
    gap: 5px;
  }
  .settingsBackgroundColorInput {
    margin-top: 8px;
    width: 120px;
    height: 32px;
    padding: 4px 10px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .settingsBackgroundColorButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  #settingsBackgrounds {
    display: flex;
    gap: 3px;
    padding: 15px;
    flex-wrap: wrap;
  }
  .backgroundImageSelectorPlaceholder {
    width: 180px;
    min-height: 115px;
    max-width: 220px;
    flex-grow: 1;
  }
  .backgroundImageSelector {
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    display: block;
  }
  .backgroundImageSelector:hover {
    filter: drop-shadow(0px 0px 2px rgb(80, 80, 80));
    transform: scale(1.1);
    z-index: 2;
  }
  @media screen and (max-width: 450px) {
    #customBackgroundsContainer {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
