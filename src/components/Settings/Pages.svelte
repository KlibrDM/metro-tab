<script>
  import PagesGroupModal from "./PagesGroupModal.svelte";
  import PagesImageModal from "./PagesImageModal.svelte";
  import PagesAllImagesModal from "./PagesAllImagesModal.svelte";
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
  export let createGroup;

  let addPageInput = ""; //Binded to input
  let allowDrag = false; // Allow drag and drop only when the mouse is over the drag handle
  let draggedItem = undefined;
  let draggedItemIndex = undefined;
  let draggedOverIndex = undefined;

  let highlightedCategoryId = undefined;

  // Tile image modal
  let imageModalActive = false;
  let selectedIndex = -1;

  // Group modal
  let groupModalActive = false;
  let selectedGroupIndex = -1;

  // All tile images modal
  let allImagesModalActive = false;

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
          class:highlighted={(page.categoryId && highlightedCategoryId === page.categoryId) || (!page.categoryId && highlightedCategoryId === "0000")}
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

            {#if !page.isGroup}
              <div class="tilePreview">
                <div
                  class="tileIcon"
                  style={`
                    background-color: ${settingsData.darkMode ? 'white' : 'black'};
                    mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(page.imageName)}.webp");
                  `}
                ></div>
              </div>
            {/if}

            {#if page.isGroup}
              <i class="fa-regular fa-folder tileFolderIcon" />
              <input
                type="text"
                id={`set_newGroupNameBox_${index}`}
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
              <span style="flex-shrink: 0; font-size: 0.9em;">({page.pages.length} {page.pages.length === 1 ? "page" : "pages"})</span>
            {:else}
              <input
                type="text"
                id={`set_newLinkBox_${index}`}
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
                  name={`categorySelect_${index}`}
                  id={`categorySelect_${index}`}
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
            <div class="settingsPageListButtonsGroup">
              {#if page.isGroup}
                <button
                  on:click={() => { groupModalActive = true; selectedGroupIndex = index; }}
                  class="viewGroupButton"
                >
                  View group
                </button>
              {:else}
                <button
                  on:click={() => { imageModalActive = true; selectedIndex = index; }}
                  class="changeTileImageButton"
                  class:changeTileImageButtonCustomImage={page.tileImageType === "custom"}
                >
                  Change image
                </button>
              {/if}
              <button
                on:click={() => { page.isActive = !page.isActive; unsavedPages = true; }}
                class="togglePageVisibilityButton"
              >
                {page.isActive ? "Hide" : "Show"}
              </button>
            </div>
            <button
              on:click={() => { deletePage(settingsData.pages, index); unsavedPages = true; }}
              class="pageDeleteButton"
            >
              <i class="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if settingsData.categories && settingsData.categories.length > 0}
    <div id="highlightCategoriesSection">
      <p>Highlight category</p>
      <div class="highlightCategoriesContainer">
        {#each settingsData.categories as category}
          <div
            class="highlightCategory"
            class:selected={highlightedCategoryId === category.id}
            on:click={() => { highlightedCategoryId = highlightedCategoryId === category.id ? undefined : category.id }}
          >
            {category.name}
          </div>
        {/each}
        <div
          class="highlightCategory"
          class:selected={highlightedCategoryId === "0000"}
          on:click={() => { highlightedCategoryId = highlightedCategoryId === "0000" ? undefined : "0000" }}
        >
          Uncategorized
        </div>
      </div>
    </div>
  {/if}

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
          class="viewAllTileImagesButton"
          on:click={() => {allImagesModalActive = true}}
        >
          View all tile images
        </button>

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

  {#if allImagesModalActive}
    <PagesAllImagesModal
      settingsData={settingsData}
      bind:unsavedPages={unsavedPages}
      bind:modalActive={allImagesModalActive}
    />
  {/if}
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  h4 {
    margin-block-start: 0.2em;
    margin-block-end: 0.4em;
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
  .viewAllTileImagesButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .viewAllTileImagesButton:hover {
    background-color: rgb(230, 200, 22);
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
    transition: 0.3s;
  }
  .settingsPagesListPage:hover {
    background-color: #f0f0f0 !important;
  }
  #settingsPages.darkModifier .settingsPagesListPage {
    border-color: #3a99ff !important;
  }
  #settingsPages.darkModifier .settingsPagesListPage:hover {
    background-color: #0c1b3a !important;
  }
  .settingsPagesListPage.highlighted {
    background-color: #d3e8ff !important;
  }
  .settingsPagesListPage.highlighted:hover {
    background-color: #bddcfd !important;
  }
  #settingsPages.darkModifier .settingsPagesListPage.highlighted {
    background-color: #093166 !important;
  }
  #settingsPages.darkModifier .settingsPagesListPage.highlighted:hover {
    background-color: #0d3f81 !important;
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
  .settingsPageCategorySelect select {
    max-width: 140px;
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
    min-width: 130px;
  }
  .viewGroupButton {
    padding: 4px 20px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    background-color: #3a99ff;
    transition: 0.3s;
  }
  .viewGroupButton:hover {
    background-color: #2f84e0;
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
  .changeTileImageButtonCustomImage {
    background-color: #3a99ff;
  }
  .changeTileImageButtonCustomImage:hover {
    background-color: #2f84e0;
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
  .tileFolderIcon {
    width: 50px;
    height: 50px;
    text-align: center;
    align-content: center;
    font-size: 30px;
    flex-shrink: 0;
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
  #highlightCategoriesSection {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 8px;
  }
  #highlightCategoriesSection p {
    margin: 0;
    flex-shrink: 0;
  }
  .highlightCategoriesContainer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 4px;
    overflow: auto;
  }
  .highlightCategory {
    padding: 4px 10px;
    border-radius: 20px;
    background-color: rgb(225, 225, 225);
    color: black;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    user-select: none;
  }
  .highlightCategory:hover {
    background-color: rgb(215, 215, 215);
  }
  .highlightCategory.selected {
    background-color: #3a99ff !important;
    color: white !important;
  }
  .highlightCategory.selected:hover {
    background-color: #2880de !important;
    color: white !important;
  }
  #settingsPages.darkModifier .highlightCategory {
    background-color: #243958;
    color: white;
  }
  #settingsPages.darkModifier .highlightCategory:hover {
    background-color: #324b70;
    color: white;
  }
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
