<script>
  import PagesImageModal from "./PagesImageModal.svelte";

  export let group;
  export let settingsData;
  export let deletePage;
  export let addPage;
  export let movePage;
  export let getImageNameFor;
  export let checkWebsite;
  export let escapeHTML;
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
</script>

<div id="settingsPageGroupModalContainer" on:click={() => { modalActive = false; }}>
  <div id="settingsPageGroupModal" class:darkModifier={settingsData.darkMode} on:click={(e) => { e.stopImmediatePropagation() }}>
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
              <i on:click={() => { imageModalActive = true; selectedImageIndex = index; }} class="fa-solid fa-image pointer" />
              <input type="checkbox" name="page" bind:checked={page.isActive} on:change={() => {unsavedPages = true}} />
              <input
                on:click={() => {
                  deletePage(group.pages, index);
                  unsavedPages = true;
                }}
                type="button"
                class="pageDeleteButton"
                value="X"
              />
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
            id="set_newPageBox"
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
  .pointer {
    cursor: pointer;
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
    height: calc(100% - 180px);
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
  }
  #settingsPageGroupModal.darkModifier {
    background-color: rgb(3, 7, 15);
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
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
