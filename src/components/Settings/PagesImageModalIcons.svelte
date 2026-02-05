<script>
  import { pageIconsList } from "../../data/config";

  export let page;
  export let unsavedPages;
  export let darkMode;

  const pages = getIconsPerPage();
  const pagesCount = pages.length;
  let activeIconPageIndex = 0;

  function getIconsPerPage() {
    const iconsCountPerPage = 48;
    let pages = [];
    for (let i = 0; i < pageIconsList.length; i += iconsCountPerPage) {
      pages.push(pageIconsList.slice(i, i + iconsCountPerPage));
    }
    return pages;
  }
</script>

<div class="iconsContainer" class:darkModifier={darkMode}>
  <div class="iconsPage">
    {#each pages[activeIconPageIndex] as icon}
      <button
        class="iconButton"
        class:active={page.iconName === icon}
        on:click={() => { page.iconName = icon; unsavedPages = true; }}
      >
        <i class={`fa-solid fa-${icon}`} style="font-size: 24px;"></i>
      </button>
    {/each}
  </div>
  <div class="iconPageNavigation">
    <button
      class="iconPageButton"
      on:click={() => { if (activeIconPageIndex > 0) activeIconPageIndex -= 1; }}
      disabled={activeIconPageIndex === 0}
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    {#each [...Array(pagesCount).keys()] as pageIndex}
      <button
        class="iconPageButton"
        class:active={activeIconPageIndex === pageIndex}
        on:click={() => activeIconPageIndex = pageIndex}
      >
        {pageIndex + 1}
      </button>
    {/each}
    <button
      class="iconPageButton"
      on:click={() => { if (activeIconPageIndex < pagesCount - 1) activeIconPageIndex += 1; }}
      disabled={activeIconPageIndex === pagesCount - 1}
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</div>

<style>
  .iconsContainer {
    display: flex;
    flex-direction: column;
  }
  .iconsPage {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
  }
  .iconButton {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    padding: 0;
    cursor: pointer;
    color: black;
    background-color: white;
    border: 1px solid #3a99ff;
    transition: 0.3s;
  }
  .iconButton:hover {
    background-color: #f3f3f3;;
  }
  .iconsContainer.darkModifier .iconButton {
    color: white;
    background-color: transparent;
  }
  .iconsContainer.darkModifier .iconButton:hover {
    background-color: #0c1b3a;
  }
  .iconButton.active {
    background-color: #3a99ff !important;
    color: white !important;
  }
  .iconButton.active:hover {
    background-color: #2f84e0 !important;
  }
  .iconPageNavigation {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    gap: 4px;
  }
  .iconPageButton {
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #3a99ff;
    background-color: white;
    color: black;
    cursor: pointer;
    transition: 0.3s;
  }
  .iconPageButton:hover {
    background-color: #f3f3f3;;
  }
  .iconsContainer.darkModifier .iconPageButton {
    color: white;
    background-color: transparent;
  }
  .iconsContainer.darkModifier .iconPageButton:hover {
    background-color: #0c1b3a;
  }
  .iconPageButton.active {
    background-color: #3a99ff !important;
    color: white !important;
  }
  .iconPageButton.active:hover {
    background-color: #2f84e0 !important;
  }
  @media screen and (max-width: 599px) {
    .iconsPage {
      grid-template-columns: repeat(8, 1fr);
    }
  }
  @media screen and (max-width: 450px) {
    .iconsPage {
      grid-template-columns: repeat(6, 1fr);
    }
    .iconPageNavigation {
      gap: 2px;
    }
    .iconPageButton {
      padding: 4px 6px;
    }
  }
</style>
