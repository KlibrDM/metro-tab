<script>
  export let darkMode;
  export let theme;
  export let applyTheme;
</script>

<div class="item" class:darkModifier={darkMode}>
  <div class="themeThumbnail">
    <img src={`static/images/themes/${theme.thumbnail}.webp`} alt={`${theme.label} preset thumbnail`} />
  </div>
  <div class="themeDetails">
    <div class="themeDetailsText">
      <h3>{theme.label}</h3>

      {#if theme.changesTiles === "full"}
        <p>Changes <span class="highlightedText">all</span> tile settings</p>
      {:else if theme.changesTiles === "partial"}
        <p>Changes <span class="highlightedText">some</span> tile settings</p>
      {/if}

      {#if theme.changesBackground}
        <p>Changes background</p>
      {/if}

      {#if theme.changesColors}
        <p>Changes colors</p>
      {/if}

      {#if theme.changesPanelColors === "dark"}
        <p>Changes panel colors to <span class="highlightedText">dark</span></p>
      {:else if theme.changesPanelColors === "light"}
        <p>Changes panel colors to <span class="highlightedText">light</span></p>
      {:else}
        <p>Doesn't change panel colors</p>
      {/if}
    </div>
    <button
      class="itemButton"
      on:click={() => applyTheme(theme.settings)}
    >
      Apply
    </button>
  </div>
</div>

<style>
  .item {
    display: flex;
    gap: 12px;
    padding: 8px 8px;
    border-radius: 10px;
    border: 1px solid lightgray;
  }
  .item.darkModifier {
    border-color: #3a99ff;
  }
  .themeThumbnail {
    width: 300px;
    min-height: 145px;
  }
  .themeThumbnail img {
    width: 100%;
    vertical-align: middle;
    border-radius: 5px;
  }
  .themeDetails {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: space-between;
  }
  .themeDetailsText h3 {
    margin: 0;
    margin-bottom: 4px;
  }
  .themeDetailsText p {
    margin: 0;
    font-size: 0.9em;
  }
  .itemButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .itemButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .highlightedText {
    color: rgb(210, 40, 40);
  }
  .item.darkModifier .highlightedText {
    color: rgb(238, 218, 34);
  }
</style>