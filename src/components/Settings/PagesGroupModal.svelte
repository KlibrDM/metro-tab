<script>
  import { checkWebsite, clearOldExtension, escapeHTML, getImageNameForLink } from "../../data/tools";
  import PagesImageModal from "./PagesImageModal.svelte";

  export let group;
  export let settingsData;
  export let deletePage;
  export let addPage;
  export let movePage;
  export let unsavedPages;
  let addPageInput = ""; //Binded to input

  let allowDrag = false; // Allow drag and drop only when the mouse is over the drag handle
  let draggedItem = undefined;
  let draggedItemIndex = undefined;
  let draggedOverIndex = undefined;

  // Tile image modal
  let imageModalActive = false;
  let selectedImageIndex = -1;

  // Group modal
  export let modalActive = false;
  let clickedOutsideModal = false;

  const handleDragEnd = (index) => {
    // If the dragged item is dropped on itself, return early
    if (index === draggedOverIndex) {
      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
      return;
    }

    if (draggedItemIndex !== undefined) {
      // Remove the dragged item from the list
      group.pages.splice(draggedItemIndex, 1);

      // Insert the dragged item at the new position
      group.pages.splice(draggedOverIndex, 0, draggedItem);

      group.pages = [...group.pages];
      unsavedPages = true;

      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
    }
  }

  document.addEventListener('mousedown', (e) => {
    clickedOutsideModal = e.target.id === 'settingsPageGroupModalContainer';
  });

  document.addEventListener('mouseup', () => {
    if(clickedOutsideModal) { modalActive = false; }
    clickedOutsideModal = false;
  });
</script>

<div id="settingsPageGroupModalContainer">
  <div id="settingsPageGroupModal" class:darkModifier={settingsData.darkMode} on:click={(e) => { e.stopImmediatePropagation() }}>
    <button id="settingsPageGroupCloseButton">
      <i class="fa-solid fa-xmark" on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}></i>
    </button>

    <h3>{group.name}</h3>

    {#if group.pages.length === 0}
      <small>No pages in this group</small>
    {/if}

    <div id="settingsPagesList">
      {#each group.pages as page, index}
        <div
          class="settingsPagesListPageContainer"
          draggable={allowDrag}
          on:dragstart={() => { draggedItem = page; draggedItemIndex = index; }}
          on:dragend={() => handleDragEnd(index)}
          on:dragover={(e) => { e.preventDefault(); draggedOverIndex = index; }}
          on:dragenter={(e) => { e.preventDefault(); }}
        >
          <div
            class="settingsPagesListPage"
            class:hiddenPage={!page.isActive}
            style="
              border-color: {index === draggedItemIndex ? 'red' : index === draggedOverIndex ? '#3a99ff' : 'lightgray'};
              background: {
                index === draggedItemIndex ? 'linear-gradient(to right, red, transparent 50px)' :
                index === draggedOverIndex ?
                  draggedItemIndex !== undefined && draggedItemIndex > index ?
                  'linear-gradient(135deg, #3a99ff, transparent 40px)' :
                  'linear-gradient(45deg, #3a99ff, transparent 40px)' :
                'unset'
              };
            "
          >
            <div class="settingsPagesGroupLeft">
              <div class="settingsDragHandle"
                on:focus={() => { allowDrag = true; }}
                on:mouseover={() => { allowDrag = true; }}
                on:mouseleave={() => { allowDrag = false; }}
              >
                <i class="fa-solid fa-grip-vertical" />
              </div>
              <div class="settingsPagesMoveButtons">
                <button
                  on:click={() => {
                    movePage(group.pages, index, "up");
                    unsavedPages = true;
                  }}
                >
                  <i class="fa-solid fa-angle-up" />
                </button>
                <button
                  on:click={() => {
                    movePage(group.pages, index, "down");
                    unsavedPages = true;
                  }}
                >
                  <i class="fa-solid fa-angle-down" />
                </button>
              </div>

              <div class="tilePreview">
                <div
                  class="tileIcon"
                  style={`
                    background-color: ${settingsData.darkMode ? 'white' : 'black'};
                    mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(page.imageName)}.webp");
                  `}
                ></div>
              </div>

              <input
                type="text"
                id={`set_newGroupLinkBox_${index}`}
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
                  page.imageName = getImageNameForLink(page.link);
                  page.tileName = page.imageName[0].toUpperCase() + page.imageName.slice(1);
                }}
              />
            </div>

            <div class="settingsPageListButtons">
              <div class="settingsPageListButtonsGroup">
                <button
                  on:click={() => { imageModalActive = true; selectedImageIndex = index; }}
                  class="changeTileImageButton"
                >
                  Change image
                  {#if page.tileImageType === "predefined"}
                    (P)
                  {/if}
                  {#if page.tileImageType === "custom"}
                    (C)
                  {/if}
                  {#if page.tileImageType === "icon"}
                    (I)
                  {/if}
                  {#if page.tileImageType === "none"}
                    (T)
                  {/if}
                </button>
                <button
                  on:click={() => { page.isActive = !page.isActive; unsavedPages = true; }}
                  class="togglePageVisibilityButton"
                >
                  {page.isActive ? "Hide" : "Show"}
                </button>
              </div>
              <button
                on:click={() => { deletePage(group.pages, index); unsavedPages = true; }}
                class="pageDeleteButton"
              >
                <i class="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  
    {#if group.pages.length < 40}
      <div id="settingsPageOptions">
        <h4>Add new page</h4>
        <form
          class="settingsPageInput"
          on:submit={(e) => {
            addPage(group.pages, addPageInput, e);
    
            //Clear page input after adding it
            addPageInput = "";
    
            unsavedPages = true;
          }}
        >
          <input
            type="text"
            id="set_newGroupPageBox"
            class="settingsTextInput"
            bind:value={addPageInput}
            placeholder="Type the address of the page"
            maxlength="500"
            required={true}
          />
          <button type="submit" class="addPageButton">Add</button>
        </form>
      </div>
    {:else}
      <small class="settingsPageInputWarning">Maximum number of pages in a group reached.</small>
    {/if}

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

  {#if imageModalActive}
    <PagesImageModal
      settingsData={settingsData}
      page={group.pages[selectedImageIndex]}
      isGroupPage={true}
      bind:unsavedPages={unsavedPages}
      bind:modalActive={imageModalActive}
    />
  {/if}
</div>

<style>
  h3 {
    margin-block-start: 0.4em;
    margin-block-end: 0.8em;
  }
  h4 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  .settingsTextInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
    background-color: transparent;
  }
  #settingsPageGroupModal.darkModifier .settingsTextInput {
    color: white;
    outline: none;
    border-color: #3a99ff;
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
  #settingsPagesList {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: calc(100% - 165px);
    padding-right: 8px;
  }
  .settingsPagesListPageContainer:not(:first-child) {
    padding-top: 3px;
  }
  .settingsPagesListPageContainer:not(:last-child) {
    padding-bottom: 2px;
  }
  .settingsPagesListPage {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid lightgray;
  }
  .settingsPagesListPage:hover {
    background-color: #f0f0f0 !important;
  }
  #settingsPageGroupModal.darkModifier .settingsPagesListPage {
    border-color: #3a99ff !important;
  }
  #settingsPageGroupModal.darkModifier .settingsPagesListPage:hover {
    background-color: #0c1b3a !important;
  }
  .settingsPagesListPage.hiddenPage {
    border-style: dashed;
    opacity: 0.6;
  }
  .settingsDragHandle {
    margin-left: 4px;
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
    background-color: transparent;
  }
  #settingsPageGroupModal.darkModifier .settingsPageLinkInput {
    color: white;
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
    background-color: rgb(230, 200, 22);
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
    gap: 5px;
  }
  .settingsPageListButtonsGroup {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 150px;
  }
  .changeTileImageButton {
    padding: 4px 20px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .changeTileImageButton:hover {
    background-color: #0c2;
  }
  .togglePageVisibilityButton {
    padding: 4px 20px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .togglePageVisibilityButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .pageDeleteButton {
    padding: 4px 12px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.3s;
  }
  .pageDeleteButton:hover {
    background-color: rgb(175, 30, 30);
  }
  .tilePreview {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-width: 40px;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
  }
  .tileIcon {
    width: 100%;
    height: 100%;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 80% auto;
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
  .settingsPageInputWarning {
    display: block;
    margin-top: 12px;
    margin-bottom: 55px;
  }
  #settingsPageGroupModalContainer {
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
  #settingsPageGroupModal {
    width: 600px;
    max-height: 70vh;
    height: 100%;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    position: relative;
  }
  #settingsPageGroupModal.darkModifier {
    background-color: rgb(3, 7, 15);
  }
  #settingsPageGroupCloseButton {
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
  #settingsPageGroupCloseButton:hover {
    color: rgb(80, 80, 80);
  }
  #returnButtonContainer {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 8px;
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
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
