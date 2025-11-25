<script>
  import { deleteAllTileImages, deleteTileImage, getTileImage, getTileImageLinks } from "../../data/storage";

  export let settingsData;
  export let unsavedPages;
  export let modalActive = false;

  let clickedOutsideModal = false;

  // Show delete tile image confirm after delete button was clicked
  let showDeleteTileImageConfirm = false;

  let localStorageUsedSpace = (new Blob(Object.values(localStorage)).size / 1024 / 1024).toFixed(2);
  let showLocalStorageInfo = false;

  let allTileImageLinks = getTileImageLinks();
  let flatMapPages = settingsData.pages.flatMap((page) => {
    return page.pages ? page.pages : [page];
  });

  const getTileImageDetails = (tileImageLinks) => {
    return tileImageLinks.map((tileImageLink) => {
      const tileImage = getTileImage(tileImageLink);
      return {
        link: tileImageLink,
        size: (new Blob([tileImage]).size / 1024 / 1024).toFixed(2),
      };
    });
  }

  let allTileImageDetails = getTileImageDetails(allTileImageLinks);

  const onDeleteAllTileImagesClick = () => {
    deleteAllTileImages();
    settingsData.pages = [...settingsData.pages];
    showDeleteTileImageConfirm = false;
    unsavedPages = true;

    allTileImageLinks = getTileImageLinks();
    allTileImageDetails = getTileImageDetails(allTileImageLinks);
    localStorageUsedSpace = (new Blob(Object.values(localStorage)).size / 1024 / 1024).toFixed(2);
  }

  const onDeleteTileImageClick = (tileImageLink) => {
    deleteTileImage(tileImageLink);
    settingsData.pages = [...settingsData.pages];
    unsavedPages = true;

    allTileImageLinks = getTileImageLinks();
    allTileImageDetails = getTileImageDetails(allTileImageLinks);
    localStorageUsedSpace = (new Blob(Object.values(localStorage)).size / 1024 / 1024).toFixed(2);
  }

  document.addEventListener('mousedown', (e) => {
    clickedOutsideModal = e.target.id === 'settingsPageAllTileImagesModalContainer';
  });

  document.addEventListener('mouseup', () => {
    if(clickedOutsideModal) { modalActive = false; }
    clickedOutsideModal = false;
  });
</script>

<div id="settingsPageAllTileImagesModalContainer">
  <div id="settingsPageAllTileImagesModal" class:darkModifier={settingsData.darkMode} on:click={(e) => { e.stopImmediatePropagation() }}>
    <button id="settingsPageAllTileImagesCloseButton">
      <i class="fa-solid fa-xmark" on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}></i>
    </button>

    <div id="settingsPageAllTileImagesHeader">
      <h4>All tile images</h4>
      <div>
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
    </div>

    <div id="settingsPageAllTileImages">
      {#each allTileImageDetails as tileImage}
        <div class="tileImage">
          <img src={getTileImage(tileImage.link)} alt="Tile preview" />
          <div class="tileImageActions">
            <p class="tileImageLink">{tileImage.link}</p>
            <p>{tileImage.size} MB</p>
            {#if flatMapPages.filter((page) => page.link === tileImage.link).length > 1}
              <!-- If the page appears multiple times -->
              <div class="warningMessage">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>This page appears multiple times.</p>
              </div>
              {#if flatMapPages.some((page) => page.link === tileImage.link && page.tileImageType !== 'custom')}
                <!-- Show a different message than if the page appears only once -->
                <div class="warningMessage">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <p>At least one of the pages is not using the custom image.</p>
                </div>
              {/if}
            {:else}
              {#if flatMapPages.some((page) => page.link === tileImage.link && page.tileImageType !== 'custom')}
                <div class="warningMessage">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <p>This page is not using the custom image.</p>
                </div>
              {/if}
            {/if}
            {#if !flatMapPages.some((page) => page.link === tileImage.link)}
              <div class="errorMessage">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>This page no longer exists.</p>
              </div>
            {/if}
            <button
              class="deleteTileImageButton"
              on:click={() => onDeleteTileImageClick(tileImage.link)}
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div id="returnButtonContainer">
      <div id="returnButtonGroup">
        <div>
          <button
            class={showDeleteTileImageConfirm ? 'cancelDeleteTileImageButton' : 'deleteAllTileImageButton'}
            on:click={() => {showDeleteTileImageConfirm = true}}
          >
            {#if showDeleteTileImageConfirm}
              Are you sure?
            {:else}
              Delete all tile images
            {/if}
          </button>

          {#if showDeleteTileImageConfirm}
            <button
              class="deleteAllTileImageButton"
              on:click={onDeleteAllTileImagesClick}
            >
              Yes
            </button>
            <button
              class="cancelDeleteTileImageButton"
              on:click={() => {showDeleteTileImageConfirm = false}}
            >
              No
            </button>
          {/if}
        </div>

        <button
          id="returnButton"
          on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}
        >
          Return
        </button>
      </div>

      <div>
        {#if unsavedPages}
          <small>After closing this window do not forget to save your changes.</small>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  h4 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  #settingsPageAllTileImagesModalContainer {
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
  #settingsPageAllTileImagesModal {
    width: 600px;
    height: 70vh;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  #settingsPageAllTileImagesModal.darkModifier {
    background-color: rgb(3, 7, 15);
  }
  #settingsPageAllTileImagesCloseButton {
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
  #settingsPageAllTileImagesCloseButton:hover {
    color: rgb(80, 80, 80);
  }
  #settingsPageAllTileImagesHeader {
    margin-bottom: 8px;
  }
  #settingsPageAllTileImagesHeader h4 {
    margin-block-start: 0;
    flex-shrink: 0;
  }
  #settingsPageAllTileImages {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: auto;
    height: 100%;
  }
  .tileImage {
    display: flex;
    gap: 8px;
  }
  .tileImage img {
    max-width: 200px;
    max-height: 400px;
    width: 100%;
    border-radius: 24px;
  }
  .tileImageActions {
    overflow: hidden;
  }
  .tileImageActions p {
    margin-block-start: 0;
    margin-block-end: 0.2em;
  }
  .tileImageLink {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2; 
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .errorMessage,
  .warningMessage {
    display: flex;
    gap: 6px;
  }
  .errorMessage i,
  .warningMessage i {
    margin-top: 3px;
    font-size: 18px;
  }
  .errorMessage i {
    color: rgb(210, 40, 40);
  }
  .warningMessage i {
    color: rgb(238, 218, 34);
  }
  .deleteTileImageButton {
    margin-top: 4px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.5s;
  }
  .deleteTileImageButton:hover {
    background-color: rgb(180, 30, 30);
  }
  .deleteAllTileImageButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.5s;
  }
  .deleteAllTileImageButton:hover {
    background-color: rgb(180, 30, 30);
  }
  .cancelDeleteTileImageButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(220, 220, 220);
    transition: 0.5s;
  }
  .cancelDeleteTileImageButton:hover {
    background-color: rgb(200, 200, 200);
  }
  #returnButtonContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 8px;
  }
  #returnButtonGroup {
    display: flex;
    justify-content: space-between;
    width: 100%;
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
  #localStorageSpace {
    display: flex;
    align-items: center;
    gap: 8px;
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
</style>
