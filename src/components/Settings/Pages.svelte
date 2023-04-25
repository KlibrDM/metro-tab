<script>
  import { getTileImage, saveTileImage } from "../../data/storage";
  import { clearOldExtension } from "../../data/tools";

  export let settingsData;
  export let deletePage;
  export let addPage;
  export let saveSettings;
  export let movePage;
  export let getImageNameFor;
  export let checkWebsite;
  export let escapeHTML;
  export let unsavedPages;
  let addPageInput = ""; //Binded to input

  // Tile image modal
  let modalActive = false;
  let selectedIndex = -1;

  let bg, fileinput;
  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      bg = e.target.result;
      //Try saving to local storage if it doesn't exceed max size
      try {
        saveTileImage(settingsData.pages[selectedIndex].link, bg);
        settingsData.pages[selectedIndex].tileImageType = "custom";
        unsavedPages = true;
      } catch {
        alert(
          "Tile image is too large and it couldn't be saved\n\nPlease resize/compress the image and try again"
        );
      }
    };
  };
</script>

<h2>Pages</h2>
<div id="settingsPages">
  <div id="settingsPagesList">
    {#each settingsData.pages as page, index}
      <div class="settingsPagesListPage">
        <div class="settingsPagesGroupLeft">
          <div class="settingsPagesMoveButtons">
            <button
              on:click={() => {
                movePage(index, "up");
                unsavedPages = true;
              }}
            >
              <i class="fa-solid fa-angle-up" />
            </button>
            <button
              on:click={() => {
                movePage(index, "down");
                unsavedPages = true;
              }}
            >
              <i class="fa-solid fa-angle-down" />
            </button>
          </div>
          <input
            type="text"
            id="set_newLinkBox"
            class="settingsPageLinkInput"
            bind:value={page.link}
            placeholder="Type the address of the page"
            maxlength="500"
            required={true}
            on:input={() => {
              unsavedPages = true;
            }}
            on:change={() => {
              page.link = escapeHTML(checkWebsite(page.link));
              page.imageName = getImageNameFor(page.link);
              page.tileName = page.imageName[0].toUpperCase() + page.imageName.slice(1);
            }}
          />
        </div>
        <div class="settingsPageListButtons">
          <i on:click={() => { modalActive = true; selectedIndex = index; }} class="fa-solid fa-image pointer" />
          <input type="checkbox" name="page" bind:checked={page.isActive} />
          <input
            on:click={() => {
              deletePage(index);
              unsavedPages = true;
            }}
            type="button"
            class="pageDeleteButton"
            value="X"
          />
        </div>
      </div>
    {/each}
  </div>

  <div id="settingsPageOptions">
    <h4>Add new page</h4>
    <form
      class="settingsPageInput"
      on:submit={(e) => {
        addPage(addPageInput, e);

        //Clear page input after adding it
        addPageInput = "";

        unsavedPages = true;
      }}
    >
      <input
        type="text"
        id="set_newPageBox"
        class="settingsTextInput"
        bind:value={addPageInput}
        placeholder="Type the address of the page"
        maxlength="500"
        required={true}
      />
      <button type="submit" class="addPageButton">Add</button>
    </form>

    <div class="settingsButtonWithError">
      <button
        on:click={(e) => {
          saveSettings(settingsData, e);
          unsavedPages = false;
        }}
        type="submit"
        class="saveSettingsButton"
      >
        Save
      </button>

      {#if unsavedPages}
        <small class="unsavedWarning">You have unsaved settings.</small>
      {/if}
    </div>
  </div>

  {#if modalActive}
    <div id="settingsPageImageTypeModalContainer" on:click={() => { modalActive = false; }}>
      <div id="settingsPageImageTypeModal" on:click={(e) => { e.stopImmediatePropagation() }}>
        <div id="imageTypeButtonGroup">
          <h4>Tile image type</h4>
          <button
            class="imageTypeButton {settingsData.pages[selectedIndex].tileImageType === 'predefined' ? 'buttonSelected' : ''}"
            on:click={() => { settingsData.pages[selectedIndex].tileImageType = 'predefined'; unsavedPages = true; }}
          >
            Predefined
          </button>
          <button
            class="imageTypeButton {settingsData.pages[selectedIndex].tileImageType === 'custom' ? 'buttonSelected' : ''}"
            on:click={() => { settingsData.pages[selectedIndex].tileImageType = 'custom'; unsavedPages = true; }}
          >
            Custom
          </button>
          <button
            class="imageTypeButton {settingsData.pages[selectedIndex].tileImageType === 'none' ? 'buttonSelected' : ''}"
            on:click={() => { settingsData.pages[selectedIndex].tileImageType = 'none'; unsavedPages = true; }}
          >
            Text
          </button>
        </div>

        {#if settingsData.pages[selectedIndex].tileImageType === 'custom' }
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
          </div>
        {/if}

        {#if settingsData.pages[selectedIndex].tileImageType === 'none' }
          <div id="solidBackgroundSettings">
            <h4>Settings</h4>
            <p>Tile name</p>
            <input
              type="text"
              id="set_pageTileName"
              class="settingsTextInput"
              bind:value={settingsData.pages[selectedIndex].tileName}
              on:change={() => { unsavedPages = true; }}
              placeholder="Page tile text"
              maxlength="20"
              required={true}
            />
            <p>Background color</p>
            <input
              type="color"
              id="set_pageBackgroundColor"
              class="settingsTextInput"
              bind:value={settingsData.pages[selectedIndex].backgroundColor}
              on:change={() => { unsavedPages = true; }}
              required={true}
            />
            <p>Text color</p>
            <input
              type="color"
              id="set_pageTextColor"
              class="settingsTextInput"
              bind:value={settingsData.pages[selectedIndex].textColor}
              on:change={() => { unsavedPages = true; }}
              required={true}
            />
          </div>
        {/if}

        <h4>Preview</h4>
        <div
          id="tilePreview"
          style="
            {
              settingsData.pages[selectedIndex].tileImageType === 'custom' && getTileImage(settingsData.pages[selectedIndex].link)
              ? 'background-image: url(' + (getTileImage(settingsData.pages[selectedIndex].link) || '') + ')'
              : settingsData.pages[selectedIndex].tileImageType !== 'none'
                ? 'background-image: url("static/images/thumbnails/' + clearOldExtension(settingsData.pages[selectedIndex].imageName) + '.avif")'
                : ''
            };
            background-color: {settingsData.pages[selectedIndex].backgroundColor};
            color: {settingsData.pages[selectedIndex].textColor};
            font-size: {settingsData.tileMinWidth / (settingsData.pages[selectedIndex].tileName.length * 0.8 <= 1.8 ? 1.8 : settingsData.pages[selectedIndex].tileName.length * 0.8)}vh;
            width: {settingsData.tileMinWidth}vh;
            height: {settingsData.tileHeight}vh;
            border: {settingsData.tileBorder}px solid rgb({settingsData.tileBorderColor.r},{settingsData.tileBorderColor.g},{settingsData.tileBorderColor.b});
            border-radius: {settingsData.tileBorderRadius}vh;
            {settingsData.tileHeight < settingsData.tileMinWidth ? 'background-size: 180% auto;' : ''}
            {!settingsData.tileZoom ? "animation: none !important" : ''}
          "
        >
          {settingsData.pages[selectedIndex].tileImageType === 'none' ? settingsData.pages[selectedIndex].tileName : ''}
        </div>
        <div id="returnButtonContainer">
          <button
            id="returnButton"
            on:click={() => { modalActive = false }}>
            Return
          </button>
          {#if unsavedPages}
            <small>After closing this window do not forget to save your changes.</small>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  h4 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  .pointer {
    cursor: pointer;
  }
  .settingsTextInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
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
  .addPageButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .addPageButton:hover {
    background-color: #0c2;
  }
  .settingsButtonWithError {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #settingsPages {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  #settingsPagesList {
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow-y: auto;
  }
  .settingsPagesListPage {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid lightgray;
  }
  .settingsPagesGroupLeft {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding-right: 8px;
  }
  .settingsPageLinkInput {
    width: 100%;
    border: 0;
    overflow-wrap: anywhere;
  }
  .settingsPagesMoveButtons {
    display: flex;
    flex-direction: column;
  }
  .settingsPagesMoveButtons button {
    width: inherit;
    font-size: 10px;
    padding: 3px 5px;
    border: 0;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .settingsPagesMoveButtons button:hover {
    background-color: rgb(238, 195, 25);
  }
  .settingsPagesMoveButtons button:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .settingsPagesMoveButtons button:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .settingsPageListButtons {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pageDeleteButton {
    border: 0;
    background-color: transparent;
    color: red;
    cursor: pointer;
  }
  .settingsPageInput {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 5px;
  }
  .settingsPageInput input {
    flex-grow: 1;
    font-size: 1.1em;
  }
  .unsavedWarning {
    display: block;
    color: red;
    margin-top: 8px;
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
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
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
    background-color: #3a99ff;
    color: white;
  }
  #tilePreview {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-width: 40px;
    background-position: center;
    background-size: cover;
    box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);
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
  #solidBackgroundSettings p {
    margin-block-start: 0.4em;
    margin-block-end: 0.2em;
  }
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
