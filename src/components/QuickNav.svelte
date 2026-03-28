<script>
  const onClickChromeTabs = (elem) => {
    chrome.tabs.create({ url: `chrome://${elem}` });
  };
</script>

<div id="browserQuickNavBox">
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" class="browserQuickNavButton" aria-label="History" on:click={() => onClickChromeTabs("history")}>
    <i class="fas fa-history" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" class="browserQuickNavButton" aria-label="Downloads" on:click={() => onClickChromeTabs("downloads")}>
    <i class="fas fa-download" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" class="browserQuickNavButton" aria-label="Bookmarks" on:click={() => onClickChromeTabs("bookmarks")}>
    <i class="fas fa-bookmark" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" class="browserQuickNavButton" aria-label="Extensions" on:click={() => onClickChromeTabs("extensions")}>
    <i class="fas fa-puzzle-piece" />
  </a>
</div>

<style>
  #browserQuickNavBox {
    position: absolute;
    display: flex;
    gap: 8px;
    left: 20px;
    z-index: 45;
  }
  .browserQuickNavButton {
    display: block;
    width: 36px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
  }
  .browserQuickNavButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  @media screen and (max-width: 400px) {
    .browserQuickNavButton {
      display: none;
    }
  }
</style>
