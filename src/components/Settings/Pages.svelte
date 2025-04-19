<script>
  import { deleteAllTileImages, getTileImage } from "../../data/storage";
  import PagesGroupModal from "./PagesGroupModal.svelte";
  import PagesImageModal from "./PagesImageModal.svelte";

  export let settingsData;
  export let deletePage;
  export let addPage;
  export let saveSettings;
  export let movePage;
  export let getImageNameFor;
  export let checkWebsite;
  export let escapeHTML;
  export let unsavedPages;
  export let createGroup;

  let addPageInput = ""; //Binded to input
  let allowDrag = false; // Allow drag and drop only when the mouse is over the drag handle
  let draggedItem = undefined;
  let draggedItemIndex = undefined;
  let draggedOverIndex = undefined;

  // Show delete tile image confirm after delete button was clicked
  let showDeleteTileImageConfirm = false;

  // Tile image modal
  let imageModalActive = false;
  let selectedIndex = -1;

  // Group modal
  let groupModalActive = false;
  let selectedGroupIndex = -1;

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
      settingsData.pages.splice(draggedItemIndex, 1);

      // Insert the dragged item at the new position
      settingsData.pages.splice(draggedOverIndex, 0, draggedItem);

      settingsData.pages = [...settingsData.pages];
      unsavedPages = true;

      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
    }
  }

  const onDeleteTileImageClick = () => {
    deleteAllTileImages();
    settingsData.pages = [...settingsData.pages];
    showDeleteTileImageConfirm = false;
    unsavedPages = true;
  }
</script>

<h2>Pages</h2>
<div id="settingsPages" class:darkModifier={settingsData.darkMode}>
  <div id="settingsPagesList">
    {#each settingsData.pages as page, index}
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
                  movePage(settingsData.pages, index, "up");
                  unsavedPages = true;
                }}
              >
                <i class="fa-solid fa-angle-up" />
              </button>
              <button
                on:click={() => {
                  movePage(settingsData.pages, index, "down");
                  unsavedPages = true;
                }}
              >
                <i class="fa-solid fa-angle-down" />
              </button>
            </div>
            {#if page.isGroup}
              <i class="fa-regular fa-folder" />
              <input
                type="text"
                id="set_newGroupNameBox"
                class="settingsPageLinkInput"
                bind:value={page.name}
                placeholder="Type the nanme of the group"
                maxlength="50"
                required={true}
                on:input={() => {
                  unsavedPages = true;
                }}
                on:change={() => {
                  page.name = escapeHTML(page.name);
                }}
              />
            {:else}
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
            {/if}

            {#if settingsData.categories.length > 0}
              <div class="settingsPageCategorySelect">
                <select
                  bind:value={page.categoryId}
                  on:change={() => {
                    unsavedPages = true;
                  }}
                >
                  <option value={undefined}>Uncategorized</option>
                  {#each settingsData.categories as category}
                    <option value={category.id}>{category.name}</option>
                  {/each}
                </select>
              </div>
            {/if}
          </div>
          <div class="settingsPageListButtons">
            {#if page.isGroup}
              <span>{page.pages.length} {page.pages.length === 1 ? "page" : "pages"}</span>
              <button
                on:click={() => { groupModalActive = true; selectedGroupIndex = index; }}
                class="viewGroupButton"
              >
                View Group
              </button>
            {:else}
              <i
                on:click={() => { imageModalActive = true; selectedIndex = index; }}
                class="fa-solid fa-image pointer"
                class:customImage={getTileImage(page.link)}
              />
            {/if}
            <input type="checkbox" name="page" bind:checked={page.isActive} on:change={() => {unsavedPages = true}} />
            <input
              on:click={() => {
                deletePage(settingsData.pages, index);
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

  <div id="settingsPageOptions">
    <h4>Add new page</h4>
    <form
      class="settingsPageInput"
      on:submit={(e) => {
        addPage(settingsData.pages, addPageInput, e);

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

    <div class="settingsActionButtons">
      <div class="settingsActionButtonWithError">
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

      <div>
        <button
          class={showDeleteTileImageConfirm ? 'cancelDeleteTileImageButton' : 'deleteTileImageButton'}
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
            class="deleteTileImageButton"
            on:click={onDeleteTileImageClick}
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

        <button
          class="createGroupButton"
          on:click={() => {
            createGroup();
            unsavedPages = true;
          }}
        >
          Create new group
        </button>
      </div>
    </div>
  </div>

  {#if imageModalActive}
    <PagesImageModal
      settingsData={settingsData}
      page={settingsData.pages[selectedIndex]}
      bind:unsavedPages={unsavedPages}
      bind:modalActive={imageModalActive}
    />
  {/if}

  {#if groupModalActive}
    <PagesGroupModal
      group={settingsData.pages[selectedGroupIndex]}
      settingsData={settingsData}
      deletePage={deletePage}
      addPage={addPage}
      movePage={movePage}
      getImageNameFor={getImageNameFor}
      checkWebsite={checkWebsite}
      escapeHTML={escapeHTML}
      bind:unsavedPages={unsavedPages}
      bind:modalActive={groupModalActive}
    />
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
    background-color: transparent;
  }
  #settingsPages.darkModifier .settingsTextInput {
    color: white;
    outline: none;
    border-color: #3a99ff;
  }
  .settingsActionButtonWithError {
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
  .viewGroupButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .viewGroupButton:hover {
    background-color: #0c2;
  }
  .createGroupButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #3a99ff;
    transition: 0.3s;
  }
  .createGroupButton:hover {
    background-color: #2f84e0;
  }
  .deleteTileImageButton {
    margin-top: 8px;
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
  .cancelDeleteTileImageButton {
    margin-top: 8px;
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
  .settingsActionButtons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  #settingsPages {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  #settingsPagesList {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
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
  #settingsPages.darkModifier .settingsPagesListPage {
    border-color: #3a99ff !important;
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
  #settingsPages.darkModifier .settingsPageLinkInput {
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
  .settingsPageCategorySelect select {
    max-width: 140px;
  }
  .settingsPageListButtons {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .customImage {
    color: #0d65c4;
  }
  #settingsPages.darkModifier .customImage {
    color: #3a99ff;
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
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: red;
    line-height: 1rem;
    padding: 6px 12px;
    border-radius: 8px;
    margin-top: 8px;
    animation: shake-bottom 4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both infinite;
    animation-delay: 2s;
  }
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
