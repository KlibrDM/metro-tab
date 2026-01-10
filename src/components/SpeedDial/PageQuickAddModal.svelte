<script>
  import { savePages } from "../../data/storage";
  import { checkWebsite, escapeHTML, getImageNameForLink } from "../../data/tools";
  import { userData } from "../../store";

  export let pages;
  export let categories;
  export let selectedCategoryIndex;
  export let modalActive = false;

  let clickedOutsideModal = false;

  let pageLinkInput = "";
  let selectedCategoryId = categories[selectedCategoryIndex]
    ? categories[selectedCategoryIndex].id
    : undefined;
  let selectedGroup = undefined;

  let groups = pages
    .filter((page) => selectedCategoryId ? page.categoryId === selectedCategoryId : page.categoryId === undefined)
    .filter((page) => page.isGroup);

  let darkMode = false;

  userData.subscribe((data) => {
    darkMode = data.darkMode;
  });

  const addPage = (event, link, category, group) => {
    event.preventDefault();

    if(group && group.pages.length >= 40) {
      return;
    }

    let list = group ? group.pages : pages;

    let linkToAdd = checkWebsite(link); // Will add http:// if user didn't already do it
    let imageName = getImageNameForLink(linkToAdd);

    // Push the new page to the pages / group list
    list.push({
      link: escapeHTML(linkToAdd),
      imageName: imageName,
      isActive: true,
      tileImageType: imageName.length > 1 ? 'predefined' : 'none',
      tileName: imageName[0].toUpperCase() + imageName.slice(1),
      backgroundColor: "#3a99ff",
      textColor: "#ffffff",
      ...(!group && category !== undefined ? { categoryId: category } : {}), // Add categoryId only if not in a group and category is defined
    });

    userData.update((state) => {
      state.pages = pages;
      return state;
    });

    savePages(pages);

    modalActive = false;
  };

  document.addEventListener('mousedown', (e) => {
    clickedOutsideModal = e.target.id === 'pageQuickAddModalContainer';
  });

  document.addEventListener('mouseup', () => {
    if(clickedOutsideModal) { modalActive = false; }
    clickedOutsideModal = false;
  });

  $: groups = pages
    .filter((page) => selectedCategoryId ? page.categoryId === selectedCategoryId : page.categoryId === undefined)
    .filter((page) => page.isGroup);

  $: if(selectedCategoryId || selectedCategoryId === undefined) {
    selectedGroup = undefined;
  }
</script>

<div id="pageQuickAddModalContainer">
  <div id="pageQuickAddModal" class:darkModifier={darkMode} on:click={(e) => { e.stopImmediatePropagation() }}>
    <button id="pageQuickAddCloseButton">
      <i class="fa-solid fa-xmark" on:click={(e) => { e.stopImmediatePropagation(); modalActive = false }}></i>
    </button>

    <h3>Add new page</h3>

    <form
      class="pageQuickAddForm"
      on:submit={(e) => {
        addPage(e, pageLinkInput, selectedCategoryId, selectedGroup);
      }}
    >
      <input
        type="text"
        id="set_quickAddNewPageBox"
        class="quickAddPageTextInput"
        bind:value={pageLinkInput}
        placeholder="Type the address of the page"
        maxlength="500"
        required={true}
      />

      {#if categories.length > 0}
        <div class="pageQuickAddCategorySelect">
          <p>Category</p>
          <select
            name="quickAddCategorySelect"
            id="quickAddCategorySelect"
            bind:value={selectedCategoryId}
          >
            <option value={undefined}>Uncategorized</option>
            {#each categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </div>
      {/if}

      {#if groups.length > 0}
        <div class="pageQuickAddGroupSelect">
          <p>Group</p>
          <select
            name="quickAddGroupSelect"
            id="quickAddGroupSelect"
            bind:value={selectedGroup}
          >
            <option value={undefined}>No group</option>
            {#each groups as group}
              <option value={group}>{group.name}</option>
            {/each}
          </select>
          {#if selectedGroup && !selectedGroup.isActive}
            <small>(This group is hidden)</small>
          {/if}
        </div>
      {/if}

      {#if selectedGroup && selectedGroup.pages.length >= 40}
        <p class="pageQuickAddInputWarning">Maximum number of pages in a group reached.</p>
      {:else}
        <button type="submit" class="addPageButton" disabled={selectedGroup && selectedGroup.pages.length >= 40}>Add</button>
      {/if}
    </form>
  </div>
</div>

<style>
  h3 {
    margin-block-start: 0.4em;
    margin-block-end: 0.8em;
  }
  #pageQuickAddModalContainer {
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 110;
  }
  #pageQuickAddModal {
    width: 600px;
    max-height: 70vh;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    position: relative;
  }
  #pageQuickAddModal.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
  }
  #pageQuickAddCloseButton {
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
  #pageQuickAddCloseButton:hover {
    color: rgb(80, 80, 80);
  }
  .quickAddPageTextInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
    background-color: transparent;
    align-self: stretch;
    font-size: 1.1em;
  }
  #pageQuickAddModal.darkModifier .quickAddPageTextInput {
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
    margin-top: 4px;
  }
  .addPageButton:hover {
    background-color: #0c2;
  }
  .pageQuickAddForm {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
    gap: 5px;
  }
  .pageQuickAddCategorySelect,
  .pageQuickAddGroupSelect {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pageQuickAddCategorySelect {
    margin: 8px 0 4px 0;
  }
  .pageQuickAddGroupSelect {
    margin: 4px 0;
  }
  .pageQuickAddCategorySelect p,
  .pageQuickAddGroupSelect p {
    margin: 0;
  }
  .pageQuickAddCategorySelect select,
  .pageQuickAddGroupSelect select {
    margin-top: 2px;
    max-width: 140px;
  }
  .pageQuickAddInputWarning {
    margin: 5px 0;
  }
</style>
