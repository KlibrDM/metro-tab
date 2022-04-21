<script>
  const onClickChromeTabs = (elem) => {
    chrome.tabs.create({ url: `chrome://${elem}` });
  };
</script>

<div id="browserQuickNavBox">
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" on:click={() => onClickChromeTabs("history")}>
    <i class="fas fa-history browserQuickNavButton" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" on:click={() => onClickChromeTabs("downloads")}>
    <i class="fas fa-download browserQuickNavButton" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" on:click={() => onClickChromeTabs("bookmarks")}>
    <i class="fas fa-bookmark browserQuickNavButton" />
  </a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" on:click={() => onClickChromeTabs("extensions")}>
    <i class="fas fa-puzzle-piece browserQuickNavButton" />
  </a>
</div>

<style>
  #browserQuickNavBox {
    position: absolute;
    left: 2vw;
    z-index: 45;
  }
  .browserQuickNavButton {
    color: rgba(220, 220, 220, 0.75);
    background-color: rgba(0, 0, 0, 0.25);
    padding: 5px 10px;
    transition: 0.3s;
  }
  .browserQuickNavButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  @media screen and (max-width: 450px) {
    .browserQuickNavButton {
      padding: 4px 7px;
    }
  }
</style>
