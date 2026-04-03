<script>
  import { STYLE_VARIABLES } from "../../data/styleVariables";

  export let settingsData;
  export let saveSettings;
  export let unsavedSettings;
  export let addCategory;
  export let deleteCategory;
  export let moveCategory;

  let addCategoryInput = ""; //Binded to input
  let allowDrag = false; // Allow drag and drop only when the mouse is over the drag handle
  let draggedItem = undefined;
  let draggedItemIndex = undefined;
  let draggedOverIndex = undefined;

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
      settingsData.categories.splice(draggedItemIndex, 1);

      // Insert the dragged item at the new position
      settingsData.categories.splice(draggedOverIndex, 0, draggedItem);

      settingsData.categories = [...settingsData.categories];
      unsavedSettings = true;

      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
    }
  }

  const deleteCategoryInterceptor = (categoryId, index) => {
    deleteCategory(index);
    unsavedSettings = true;

    settingsData.pages.forEach(page => {
      if (page.categoryId === categoryId) {
        page.categoryId = undefined;
      }
    });

    if (settingsData.startingCategoryId === categoryId) {
      settingsData.startingCategoryId = null;
    }
  }

  $:showUncategorized = settingsData.pages.filter((page) => page.categoryId === undefined && page.isActive).length > 0;
</script>

<div id="settingsCategories" class:darkModifier={settingsData.darkMode}>
  <div id="settingsCategoriesList">
    {#if settingsData.categories.length === 0}
      <div class="settingsCategoriesListEmpty">
        Categories list is empty
      </div>
    {/if}
    {#each settingsData.categories as category, index}
      <div
        class="settingsCategoriesListCategoryContainer"
        draggable={allowDrag}
        on:dragstart={() => { draggedItem = category; draggedItemIndex = index; }}
        on:dragend={() => handleDragEnd(index)}
        on:dragover={(e) => { e.preventDefault(); draggedOverIndex = index; }}
        on:dragenter={(e) => { e.preventDefault(); }}
      >
        <div
          class="settingsCategoriesListCategory"
          style="
            border-color: {index === draggedItemIndex ? 'red' : index === draggedOverIndex ? '#3a99ff' : 'transparent'};
            background: {
              index === draggedItemIndex ? `linear-gradient(to right, red, ${settingsData.darkMode ? STYLE_VARIABLES["--settings-background-secondary-color-dark"] : STYLE_VARIABLES["--settings-background-secondary-color"]} 50px)` :
              index === draggedOverIndex ?
                draggedItemIndex !== undefined && draggedItemIndex > index ?
                `linear-gradient(135deg, #3a99ff, ${settingsData.darkMode ? STYLE_VARIABLES["--settings-background-secondary-color-dark"] : STYLE_VARIABLES["--settings-background-secondary-color"]} 40px)` :
                `linear-gradient(45deg, #3a99ff, ${settingsData.darkMode ? STYLE_VARIABLES["--settings-background-secondary-color-dark"] : STYLE_VARIABLES["--settings-background-secondary-color"]} 40px)` :
              `${settingsData.darkMode ? STYLE_VARIABLES["--settings-background-secondary-color-dark"] : STYLE_VARIABLES["--settings-background-secondary-color"]}`
            };
          "
        >
          <div class="settingsCategoriesGroupLeft">
            <div class="settingsDragHandle"
              on:focus={() => { allowDrag = true; }}
              on:mouseover={() => { allowDrag = true; }}
              on:mouseleave={() => { allowDrag = false; }}
            >
              <i class="fa-solid fa-grip-vertical" />
            </div>
            <div class="settingsCategoriesMoveButtons">
              <button
                on:click={() => {
                  moveCategory(index, "up");
                  unsavedSettings = true;
                }}
              >
                <i class="fa-solid fa-angle-up" />
              </button>
              <button
                on:click={() => {
                  moveCategory(index, "down");
                  unsavedSettings = true;
                }}
              >
                <i class="fa-solid fa-angle-down" />
              </button>
            </div>

            <input
              type="text"
              id={`set_newCategoryBox_${index}`}
              class="settingsCategoryInput"
              bind:value={category.name}
              placeholder="Type the name of the category"
              maxlength="25"
              required={true}
              on:input={() => {
                unsavedSettings = true;
              }}
            />
          </div>
          <div class="settingsCategoryListButtons">
            <button
              on:click={() => deleteCategoryInterceptor(category.id, index)}
              class="categoryDeleteButton"
            >
              <i class="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if settingsData.categories.length > 0}
    <div id="startingCategoryContainer">
      <div id="startingCategorySection">
        <p>Open new tab on category</p>
        <select
          id="startingCategorySelect"
          bind:value={settingsData.startingCategoryId}
          on:change={() => { unsavedSettings = true; }}
        >
          <option value={null}>Last visited</option>
          {#each settingsData.categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
          {#if showUncategorized}
            <option value={"0000"}>Uncategorized</option>
          {:else}
            <option value={"0000"} disabled>Uncategorized (Not available)</option>
          {/if}
        </select>
      </div>
    </div>
  {/if}

  <div id="settingsCategoryOptions">
    <h4>Add new page category</h4>
    <form
      class="settingsNewCategoryInput"
      on:submit={(e) => {
        addCategory(addCategoryInput, e);

        //Clear category input after adding it
        addCategoryInput = "";

        unsavedSettings = true;
      }}
    >
      <input
        type="text"
        id="set_newCategoryBox"
        class="settingsTextInput"
        bind:value={addCategoryInput}
        placeholder="Type the name of the category"
        maxlength="25"
        required={true}
      />
      <button type="submit" class="addCategoryButton">Add</button>
    </form>

    <div class="settingsActionButtons">
      <div class="settingsActionButtonWithError">
        <button
          on:click={(e) => {
            saveSettings(settingsData, e);
            unsavedSettings = false;
          }}
          type="submit"
          class="saveSettingsButton"
        >
          Save
        </button>
        {#if unsavedSettings}
          <small class="unsavedWarning">You have unsaved settings.</small>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
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
  #settingsCategories.darkModifier .settingsTextInput {
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
  .addCategoryButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .addCategoryButton:hover {
    background-color: #0c2;
  }
  .settingsActionButtons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  #settingsCategories {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #settingsCategoriesList {
    display: flex;
    flex-direction: column;
    gap: 6px;
    height: 100%;
    overflow-y: auto;
    padding: 20px;
  }
  .settingsCategoriesListEmpty {
    padding: 12px;
    border-radius: 10px;
    box-shadow: var(--shadow-small-strong);
    background-color: var(--settings-background-secondary-color);
  }
  #settingsCategories.darkModifier .settingsCategoriesListEmpty {
    border: 1px solid var(--primary-color);
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsCategoriesListCategory {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
    border-radius: 10px;
    background-color: var(--settings-background-secondary-color);
    border: 1px solid transparent;
    transition: 0.3s;
    box-shadow: var(--shadow-small-strong);
  }
  .settingsCategoriesListCategory:hover {
    background-color: #f8faff !important;
  }
  #settingsCategories.darkModifier .settingsCategoriesListCategory {
    border-color: #3a99ff !important;
    background-color: var(--settings-background-secondary-color-dark);
  }
  #settingsCategories.darkModifier .settingsCategoriesListCategory:hover {
    background-color: #0c1b3a !important;
  }
  .settingsDragHandle {
    margin-left: 4px;
  }
  .settingsCategoriesGroupLeft {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding-right: 8px;
  }
  .settingsCategoryInput {
    width: 100%;
    border: 0;
    overflow-wrap: anywhere;
    background-color: transparent;
  }
  #settingsCategories.darkModifier .settingsCategoryInput {
    color: white;
  }
  .settingsCategoriesMoveButtons {
    display: flex;
    flex-direction: column;
  }
  .settingsCategoriesMoveButtons button {
    width: inherit;
    font-size: 10px;
    padding: 3px 5px;
    border: 0;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .settingsCategoriesMoveButtons button:hover {
    background-color: rgb(230, 200, 22);
  }
  .settingsCategoriesMoveButtons button:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .settingsCategoriesMoveButtons button:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .settingsCategoryListButtons {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .categoryDeleteButton {
    padding: 8px 8px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.3s;
  }
  .categoryDeleteButton:hover {
    background-color: rgb(175, 30, 30);
  }
  #settingsCategoryOptions {
    background-color: var(--settings-background-secondary-color);
    padding: 10px 20px 20px 20px;
    box-shadow: var(--shadow-small-subtle-up);
    z-index: 1;
  }
  #settingsCategories.darkModifier #settingsCategoryOptions {
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsNewCategoryInput {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 5px;
  }
  .settingsNewCategoryInput input {
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
  #startingCategoryContainer {
    flex-shrink: 0;
    display: flex;
    margin: 6px 28px 6px 20px;
  }
  #startingCategorySection {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-y: auto;
    border-radius: 20px;
    background-color: var(--settings-background-secondary-color);
    padding: 8px 12px 8px 12px;
    box-shadow: var(--shadow-small-strong);
  }
  #settingsCategories.darkModifier #startingCategorySection {
    background-color: var(--settings-background-secondary-color-dark);
  }
  #startingCategorySection p {
    margin: 0;
    flex-shrink: 0;
  }
</style>
