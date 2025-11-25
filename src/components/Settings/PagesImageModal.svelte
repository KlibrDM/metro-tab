<script>
  import { deleteTileImage, getTileImage, saveTileImage } from "../../data/storage";
  import { clearOldExtension, getBackgroundFormat } from "../../data/tools";
  import { userData } from "../../store";

  export let page;
  export let settingsData;
  export let unsavedPages;
  export let modalActive = false;

  let localStorageUsedSpace = (new Blob(Object.values(localStorage)).size / 1024 / 1024).toFixed(2);
  let showLocalStorageInfo = false;

  let clickedOutsideModal = false;

  let backgroundImage;
  let isBackgroundSolid = false;
  let backgroundSolidColor;

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    isBackgroundSolid = data.isBackgroundSolid;
    backgroundSolidColor = data.backgroundSolidColor;
  });

  let bg, fileinput;
  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      bg = e.target.result;
      //Try saving to local storage if it doesn't exceed max size
      try {
        saveTileImage(page.link, bg);
        page.tileImageType = "custom";
        unsavedPages = true;
      } catch {
        alert(
          "Tile image is too large and it couldn't be saved\n\nPlease resize/compress the image and try again"
        );
      }
    };
  };

  const onDeleteImage = () => {
    deleteTileImage(page.link);
    page.tileImageType = "custom";
    unsavedPages = true;
  }

  document.addEventListener('mousedown', (e) => {
    clickedOutsideModal = e.target.id === 'settingsPageImageTypeModalContainer';
  });

  document.addEventListener('mouseup', () => {
    if(clickedOutsideModal) { modalActive = false; }
    clickedOutsideModal = false;
  });

  $: if (bg || page.tileImageType === 'custom') {
    // On custom image change, recalculate local storage size
    localStorageUsedSpace = (new Blob(Object.values(localStorage)).size / 1024 / 1024).toFixed(2);
  }
</script>

<div id="settingsPageImageTypeModalContainer">
  <div id="settingsPageImageTypeModal" class:darkModifier={settingsData.darkMode} on:click={(e) => { e.stopImmediatePropagation() }}>
    <button id="settingsPageImageTypeCloseButton">
      <i class="fa-solid fa-xmark" on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}></i>
    </button>

    <div id="imageTypeButtonGroup">
      <h4>Tile image type</h4>
      <button
        class="imageTypeButton {page.tileImageType === 'predefined' ? 'buttonSelected' : ''}"
        on:click={() => { page.tileImageType = 'predefined'; unsavedPages = true; }}
      >
        Predefined
      </button>
      <button
        class="imageTypeButton {page.tileImageType === 'custom' ? 'buttonSelected' : ''}"
        on:click={() => { page.tileImageType = 'custom'; unsavedPages = true; }}
      >
        Custom
      </button>
      <button
        class="imageTypeButton {page.tileImageType === 'none' ? 'buttonSelected' : ''}"
        on:click={() => { page.tileImageType = 'none'; unsavedPages = true; }}
      >
        Text
      </button>
      {#if settingsData.useFrostedGlass}
        <p id="frostedGlassActiveInfo">* Frosted glass design is enabled.</p>
      {/if}
    </div>

    {#if page.tileImageType === 'custom' }
      <div id="customImage">
        <h4>Custom background image</h4>
        <button
          class="customImageButton"
          on:click={() => {
            fileinput.click();
          }}
        >
          Upload image
        </button>
        <input
          style="display:none"
          type="file"
          accept=".jpg, .jpeg, .png, .webp, .avif"
          on:change={(e) => onFileSelected(e)}
          bind:this={fileinput}
        />

        {#if page.tileImageType === 'custom' && getTileImage(page.link)}
          <button
            class="deleteCustomImageButton"
            on:click={onDeleteImage}
          >
            Delete image
          </button>
        {/if}

        <div id="localStorageSpace">
          <small>Local storage space</small>
          <div id="spaceBar">
            <div id="spaceBarUsed" class:danger={localStorageUsedSpace > 4} style={`width: ${localStorageUsedSpace*100/5}%`}></div>
            <p id="spaceBarText">{localStorageUsedSpace} MB / 5.00 MB</p>
          </div>
          <button id="localStorageInfoButton" on:click={() => {showLocalStorageInfo = !showLocalStorageInfo}}>
            <i class="fa-solid fa-info" />
          </button>
        </div>
        {#if showLocalStorageInfo}
          <small>
            Local storage is used to store your settings, background images, tile custom images, and notes.
          </small>
        {/if}
      </div>
    {/if}

    {#if page.tileImageType === 'none' }
      <div id="solidBackgroundSettings">
        <h4>Settings</h4>
        <p>Tile name</p>
        <input
          type="text"
          id="set_pageTileName"
          class="settingsTextInput"
          bind:value={page.tileName}
          on:change={() => { unsavedPages = true; }}
          placeholder="Page tile text"
          maxlength="20"
          required={true}
        />
        <p>Background color {settingsData.useFrostedGlass ? '(Frosted glass color has priority)' : ''}</p>
        <input
          type="color"
          id="set_pageBackgroundColor"
          class="settingsTextInput"
          bind:value={page.backgroundColor}
          on:change={() => { unsavedPages = true; }}
          required={true}
        />
        <p>Text color {settingsData.useFrostedGlass ? '(Frosted glass accent color has priority)' : ''}</p>
        <input
          type="color"
          id="set_pageTextColor"
          class="settingsTextInput"
          bind:value={page.textColor}
          on:change={() => { unsavedPages = true; }}
          required={true}
        />
      </div>
    {/if}

    <h4>Preview</h4>
    <div
      id="tilePreviewContainer"
      style={isBackgroundSolid
        ? "background-color: " + backgroundSolidColor + ";"
        : backgroundImage.length > 5
          ? "background-image: url(" + backgroundImage + ");"
          : "background-image: url(" + "static/images/bg/" + backgroundImage + "." + getBackgroundFormat(backgroundImage) + ");"}
    >
      <div
        id="tilePreview"
        style="
          {
            page.tileImageType === 'custom' && getTileImage(page.link)
            ? 'background-image: url(' + (getTileImage(page.link) || '') + ');'
            : page.tileImageType !== 'none'
              ? settingsData.useFrostedGlass
                ? ''
                : 'background-image: url("static/images/thumbnails/' + clearOldExtension(page.imageName) + '.avif");'
              : ''
          }
          {
            settingsData.useFrostedGlass ? `
              backdrop-filter: blur(${settingsData.frostedGlassStrength}px);
              -webkit-backdrop-filter: blur(${settingsData.frostedGlassStrength}px);
              background-color: rgba(${settingsData.frostedGlassColor.r}, ${settingsData.frostedGlassColor.g}, ${settingsData.frostedGlassColor.b}, ${settingsData.frostedGlassOpacity}) !important;
            `
            : ''
          }
          {settingsData.showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
          background-color: {page.backgroundColor};
          color: {settingsData.useFrostedGlass ? `rgb(${settingsData.frostedGlassAccentColor.r}, ${settingsData.frostedGlassAccentColor.g}, ${settingsData.frostedGlassAccentColor.b})` : page.textColor};
          font-size: {settingsData.tileMinWidth / (page.tileName.length * 0.8 <= 1.8 ? 1.8 : page.tileName.length * 0.8)}vh;
          width: {settingsData.tileMinWidth}vh;
          height: {settingsData.tileHeight}vh;
          border: {settingsData.tileBorder}px solid rgb({settingsData.tileBorderColor.r},{settingsData.tileBorderColor.g},{settingsData.tileBorderColor.b});
          border-radius: {settingsData.tileBorderRadius}vh;
          {settingsData.tileHeight < settingsData.tileMinWidth ? 'background-size: 180% auto;' : ''}
          {!settingsData.tileZoom ? "animation: none !important" : ''}
        "
      >
        {#if settingsData.useFrostedGlass && (page.tileImageType === 'predefined' || (page.tileImageType === 'custom' && !getTileImage(page.link)))}
          <div
            class="frostedGlassIcon"
            style={`
              background-color: rgb(${settingsData.frostedGlassAccentColor.r}, ${settingsData.frostedGlassAccentColor.g}, ${settingsData.frostedGlassAccentColor.b});
              border-radius: ${settingsData.tileBorderRadius}vh;
              mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(page.imageName)}.webp");
              ${settingsData.tileHeight < settingsData.tileMinWidth ? 'mask-size: 40% auto;' : 'mask-size: 70% auto;'}
            `}
          ></div>
        {/if}
        {page.tileImageType === 'none' ? page.tileName : ''}
      </div>
    </div>

    <div id="returnButtonContainer">
      <button
        id="returnButton"
        on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}>
        Return
      </button>
      {#if unsavedPages}
        <small>After closing this window do not forget to save your changes.</small>
      {/if}
    </div>
  </div>
</div>

<style>
  h4 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  .settingsTextInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
  }
  #settingsPageImageTypeModalContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #settingsPageImageTypeModal {
    width: 600px;
    max-height: 70vh;
    overflow: auto;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    position: relative;
  }
  #settingsPageImageTypeModal.darkModifier {
    background-color: rgb(3, 7, 15);
  }
  #settingsPageImageTypeCloseButton {
    position: absolute;
    top: 12px;
    right: 12px;
    border: 0;
    background: none;
    font-size: 20px;
    cursor: pointer;
    color: rgb(140, 140, 140);
    transition: 0.3s;
  }
  #settingsPageImageTypeCloseButton:hover {
    color: rgb(80, 80, 80);
  }
  .imageTypeButton {
    padding: 8px 20px;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: white;
    border: 1px solid #3a99ff;
    transition: 0.3s;
  }
  .buttonSelected {
    background-color: #3a99ff !important;
    color: white !important;
  }
  #settingsPageImageTypeModal.darkModifier .imageTypeButton {
    color: white;
    background-color: transparent;
  }
  #tilePreviewContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 24px;
    border-radius: 16px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  #tilePreview {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-width: 40px;
    background-position: center;
    background-size: cover;
  }
  .frostedGlassIcon {
    width: 100%;
    height: 100%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
  #returnButtonContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 16px;
  }
  #returnButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #3a99ff;
    transition: 0.3s;
  }
  #returnButton:hover {
    background-color: #2f84e0;
  }
  .customImageButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .customImageButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .deleteCustomImageButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.3s;
  }
  .deleteCustomImageButton:hover {
    background-color: rgb(180, 30, 30);
  }
  #localStorageSpace {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }
  #localStorageSpace small {
    margin-bottom: 4px;
  }
  #localStorageSpace p {
    margin: 0;
  }
  #spaceBar {
    width: 200px;
    height: 15px;
    border-radius: 10px;
    background-color: #ddd;
    position: relative;
  }
  #spaceBarUsed {
    min-width: 3%;
    height: 15px;
    border-radius: 10px;
    background-color: #0b1;
  }
  #spaceBarUsed.danger {
    background-color: rgb(255, 125, 70);
  }
  #spaceBarText {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 11px;
    font-weight: bold;
    color: #333;
  }
  #localStorageInfoButton {
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
  }
  #localStorageInfoButton:hover {
    background-color: rgb(230, 200, 22);
  }
  #solidBackgroundSettings p {
    margin-block-start: 0.4em;
    margin-block-end: 0.2em;
  }
  #frostedGlassActiveInfo {
    margin-block-start: 0.2em;
    margin-block-end: 0;
  }
</style>
