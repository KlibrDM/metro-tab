<script>
  import { userData } from "../../store";
  import { backgrounds, sourceDetails } from "../../data/config";
  import { getBackgroundFormat } from "../../data/tools";
  import CustomBackgrounds from "./CustomBackgrounds.svelte";

  export let changeBackground;
  export let changeBackgroundColor;

  let backgroundImage;
  let savedBackgroundSolidColor;
  let newBackgroundSolidColor;
  let isBackgroundSolid;
  let backgroundSolidColorChanged = false;
  let backgroundSources = new Set();

  //Add sources to set
  backgrounds.forEach((bg) => {
    if(sourceDetails.get(bg.source)){
      backgroundSources.add(sourceDetails.get(bg.source));
    }
  });

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    savedBackgroundSolidColor = data.backgroundSolidColor;
    newBackgroundSolidColor = data.backgroundSolidColor;
    isBackgroundSolid = data.isBackgroundSolid;
  });

  $: backgroundImageUrl = "static/images/bg/thumbnails/" + backgroundImage + "." + getBackgroundFormat(backgroundImage);
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

<h2>Gallery</h2>
{#each [...backgroundSources] as source}
  <small>
    Background images provided by <a href="{source.url}">{source.label}</a>
  </small>
  <div class="settingsBackgrounds">
    {#each backgrounds as bg, index}
      {#if bg.source === source.name}
        <div class="backgroundImageSelectorPlaceholder">
          <img
            src="static/images/bg/thumbnails/{bg.name}.{bg.format}"
            alt="Background {index + 1}"
            class="backgroundImageSelector"
            on:click={() => changeBackground(bg.name)}
          />
        </div>
      {/if}
    {/each}
  </div>
{/each}

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
  .settingsBackgrounds {
    display: flex;
    gap: 3px;
    padding: 15px;
    flex-wrap: wrap;
    margin-bottom: 10px;
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
