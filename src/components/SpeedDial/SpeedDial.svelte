<script>
  import { getCurrentSelectedCategoryIndex, saveCurrentSelectedCategoryIndex } from "../../data/storage";
  import { userData } from "../../store";
  import SpeedDialItems from "./SpeedDialItems.svelte";

  const storageCategoryIndex = getCurrentSelectedCategoryIndex();
  let firstRender = true;

  let pages = [];
  let categories = [];
  let tileZoom;
  let tileGrow;
  let tileMinWidth;
  let tileHeight;
  let tileGap;
  let tileBorder;
  let tileBorderRadius;
  let tileBorderColor;
  let groupTileGap;
  let groupTileBorderRadius;
  let groupTileGrow;
  let showSearchBar;
  let showElementsShadow;
  let useFrostedGlass;
  let frostedGlassStrength;
  let frostedGlassOpacity;
  let frostedGlassColor;
  let frostedGlassAccentColor;

  let selectedCategoryIndex = 0;
  let selectedCategoryId = undefined;
  let showCategoryNavigation = false;

  let windowInnerWidth = 0;

  userData.subscribe((data) => {
    pages = data.pages;
    categories = data.categories;
    tileZoom = data.tileZoom;
    tileGrow = data.tileGrow;
    tileMinWidth = data.tileMinWidth;
    tileHeight = data.tileHeight;
    tileGap = data.tileGap;
    tileBorder = data.tileBorder;
    tileBorderRadius = data.tileBorderRadius;
    tileBorderColor = data.tileBorderColor;
    groupTileGap = data.groupTileGap;
    groupTileBorderRadius = data.groupTileBorderRadius;
    groupTileGrow = data.groupTileGrow;
    showSearchBar = data.showSearchBar;
    showElementsShadow = data.showElementsShadow;
    useFrostedGlass = data.useFrostedGlass;
    frostedGlassStrength = data.frostedGlassStrength;
    frostedGlassOpacity = data.frostedGlassOpacity;
    frostedGlassColor = data.frostedGlassColor;
    frostedGlassAccentColor = data.frostedGlassAccentColor;

    if(firstRender) {
      // Set the selected category index based on local storage when the component mounts
      if(pages.filter((page) => page.categoryId === undefined && page.isActive).length > 0) {
        selectedCategoryIndex = storageCategoryIndex > categories.length ? 0 : storageCategoryIndex;
      }
      else {
        selectedCategoryIndex = storageCategoryIndex >= categories.length ? 0 : storageCategoryIndex;
      }
      firstRender = false;
    }

    // After categories layout changes, check if navigation should be shown
    setTimeout(() => {
      const categoriesList = document.querySelector("#categoriesList");
      if (categoriesList) {
        showCategoryNavigation = categoriesList.scrollWidth > categoriesList.clientWidth;
      }
    }, 0);
  });

  const onCategoryNavigationClick = (directionMultiplier) => {
    const categoriesList = document.querySelector("#categoriesList");
    const windowWidth = window.innerWidth;

    categoriesList.scrollLeft += directionMultiplier * (windowWidth * 0.55 - (windowWidth > 400 ? 100 : 20));
  };

  // Change the selected category index when the categories change
  $:if(selectedCategoryId) {
    const categoryIndex = categories.findIndex((category) => category.id === selectedCategoryId);
    if (categoryIndex === -1) {
      selectedCategoryIndex = selectedCategoryIndex === categories.length ? categories.length : 0;
      selectedCategoryId = selectedCategoryIndex === categories.length ? "0000" : categories.length ? categories[0].id : undefined;
    }
    else {
      selectedCategoryIndex = categoryIndex;
      selectedCategoryId = categories[selectedCategoryIndex].id;
    }
  }

  // On mount and on resize check if the category navigation buttons should be shown
  $:if(windowInnerWidth) {
    const categoriesList = document.querySelector("#categoriesList");
    if (categoriesList) {
      showCategoryNavigation = categoriesList.scrollWidth > categoriesList.clientWidth;
    }
  }

  // Save the selected category index to local storage when it changes
  $: {
    saveCurrentSelectedCategoryIndex(selectedCategoryIndex);
  }
</script>

<svelte:window bind:innerWidth={windowInnerWidth} />

<div class="speedDial">
  {#each categories as category, index}
    <SpeedDialItems
      pages={pages.filter((page) => page.categoryId === category.id)}
      categories={categories}
      isShown={selectedCategoryIndex === index}
      tileZoom={tileZoom}
      tileGrow={tileGrow}
      tileMinWidth={tileMinWidth}
      tileHeight={tileHeight}
      tileGap={tileGap}
      tileBorder={tileBorder}
      tileBorderRadius={tileBorderRadius}
      tileBorderColor={tileBorderColor}
      groupTileGap={groupTileGap}
      groupTileBorderRadius={groupTileBorderRadius}
      groupTileGrow={groupTileGrow}
      showSearchBar={showSearchBar}
      showElementsShadow={showElementsShadow}
      useFrostedGlass={useFrostedGlass}
      frostedGlassStrength={frostedGlassStrength}
      frostedGlassOpacity={frostedGlassOpacity}
      frostedGlassColor={frostedGlassColor}
      frostedGlassAccentColor={frostedGlassAccentColor}
    />
  {/each}

  <SpeedDialItems
    pages={categories.length ? pages.filter((page) => page.categoryId === undefined) : pages}
    categories={categories}
    isShown={selectedCategoryIndex === categories.length}
    tileZoom={tileZoom}
    tileGrow={tileGrow}
    tileMinWidth={tileMinWidth}
    tileHeight={tileHeight}
    tileGap={tileGap}
    tileBorder={tileBorder}
    tileBorderRadius={tileBorderRadius}
    tileBorderColor={tileBorderColor}
    groupTileGap={groupTileGap}
    groupTileBorderRadius={groupTileBorderRadius}
    groupTileGrow={groupTileGrow}
    showSearchBar={showSearchBar}
    showElementsShadow={showElementsShadow}
    useFrostedGlass={useFrostedGlass}
    frostedGlassStrength={frostedGlassStrength}
    frostedGlassOpacity={frostedGlassOpacity}
    frostedGlassColor={frostedGlassColor}
    frostedGlassAccentColor={frostedGlassAccentColor}
  />
</div>

{#if categories.length}
  <div class="categoriesContainer">
    <div class="categories">
      {#if showCategoryNavigation}
        <div class="categoryNavigation">
          <i class="fa-solid fa-chevron-left" on:click={() => onCategoryNavigationClick(-1)} />
        </div>
      {/if}

      <div id="categoriesList" class="categoriesList">
        {#each categories as category, index}
          <div
            class="category"
            class:selected={selectedCategoryIndex === index}
            on:click={() => {
              selectedCategoryIndex = index;
              selectedCategoryId = category.id;
            }}
          >
            {category.name}
          </div>
        {/each}

        {#if pages.filter((page) => page.categoryId === undefined && page.isActive).length > 0}
          <div
            class="category"
            class:selected={selectedCategoryIndex === categories.length}
            on:click={() => {
              selectedCategoryIndex = categories.length;
              selectedCategoryId = "0000";
            }}
          >
            Uncategorized
          </div>
        {/if}
      </div>

      {#if showCategoryNavigation}
        <div class="categoryNavigation">
          <i class="fa-solid fa-chevron-right" on:click={() => onCategoryNavigationClick(1)} />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .categoriesContainer {
    display: flex;
    justify-content: center;
    height: 32px;
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
  }
  .categoriesContainer:not(:has(.categoryNavigation)) .categories {
    padding: 0px 16px;
  }
  .categories {
    display: flex;
    align-items: center;
    padding: 0px 4px;
    border-radius: 100px;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.35);
    transition: 0.3s;
    z-index: 5;
  }
  .categoryNavigation i {
    color: white;
    padding: 4px 8px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 0.9em;
    user-select: none;
  }
  .categoryNavigation i:hover {
    color: rgb(230, 230, 230);
  }
  .categoriesList {
    display: flex;
    gap: 16px;
    max-width: 55vw;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    scroll-behavior: smooth;
  }
  .category {
    color: white;
    line-height: 1.8rem;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    font-size: 1.1em;
  }
  .category:hover {
    color: rgb(230, 230, 230);
  }
  .category.selected {
    color: #3a99ff;
    text-shadow: 0px 0px 2px #3a99ff;
  }
  .category.selected:hover {
    color: #2880de;
  }
  .speedDial {
    position: relative;
  }
</style>
