<script>
  import { searchEngineList } from "../../data/config";

  export let settingsData;
  export let changeSearchEngine;

  let copiedIndex = null;

  const handleOpenSettings = () => {
    chrome.tabs.create({ url: 'chrome://settings/search' });
  };

  const handleOpenGuide = () => {
    window.open('https://support.google.com/chrome/answer/95426', "_blank");
  };

  const handleCopyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    copiedIndex = index;
    setTimeout(() => {
      copiedIndex = null;
    }, 5000);
  };

  $: searchEngineLabel = searchEngineList.find(engine => engine.name === settingsData.searchEngine)?.label || "Custom";
</script>

<div id="settingsSearchEngine" class:darkModifier={settingsData.darkMode}>
  <div id="defaultSearchEngine">
    <h2>Default Search Engine <span style="font-size: 0.8em;">(browser provided)</span></h2>
    <p>The extension will use the default search engine provided by your browser. You can change it from your browser's settings.</p>
    <div class="itemButtons">
      {#if settingsData.searchEngine === "default"}
        <button disabled class="itemActive">Active</button>
      {:else}
        <button
          class="itemButton"
          on:click={() => {
            settingsData.searchEngine = "default";
            changeSearchEngine("default")
          }}
        >
          Set as active
        </button>
      {/if}
      <button class="openSettingsButton" on:click={handleOpenSettings}>
        Open settings
      </button>
      <button class="openGuideButton" on:click={handleOpenGuide}>
        How to change?
      </button>
    </div>
  </div>

  {#if settingsData.searchEngine !== "default"}
    <div id="settingsLegacySearchEngine">
      <h2>Custom Search Engine</h2>
      <p>It was detected that you previously used the {searchEngineLabel} search engine.</p>
      <p>The extension will use the search engine that was previously set, but due to Chrome's Extension Guidelines, moving forward you will have to change the search engine from your browser's settings and activate the Default Search Engine option.</p>
      <p>Once you activate the Default Search Engine option, this Custom Search Engine will no longer be available.</p>
      <div class="item">
        {#if settingsData.searchEngine === "custom"}
          <p>Custom Search Engine: {settingsData.customSearchEngineUrl}</p>
        {:else}
          <p>{searchEngineLabel}</p>
        {/if}
        <button disabled class="itemActive">Active</button>
      </div>
    </div>
  {/if}

  <div id="searchEngineOptions">
    <h2>Custom Search Engines List</h2>
    <p>Below you can find a list of custom search engines that you can set in your browser's settings.</p>
    <p>This is a list of popular search engines. You may use any other search engine as well.</p>
    <div class="table">
      <div class="optionRow header">
        <p>Search Engine</p>
        <p>Custom URL</p>
        <p></p>
      </div>
      {#each searchEngineList as searchEngine, index}
        <div class="optionRow">
          <p>{searchEngine.label}</p>
          <p>{searchEngine.link}%s</p>
          <button
            class="copyToClipboardButton"
            on:click={() => {
              handleCopyToClipboard(`${searchEngine.link}%s`, index);
            }}
          >
            {#if copiedIndex === index}
              Copied!
            {:else}
              Copy to Clipboard
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  h2 {
    margin-block-start: 0.2em;
    margin-block-end: 0.4em;
  }
  #settingsSearchEngine {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #settingsSearchEngine.darkModifier .item {
    border: 1px solid var(--primary-color);
    background-color: var(--settings-background-secondary-color-dark);
  }
  #settingsSearchEngine.darkModifier .item:hover {
    background-color: #0c1b3a !important;
  }
  #defaultSearchEngine,
  #settingsLegacySearchEngine,
  #searchEngineOptions {
    padding: 10px 30px 20px;
    border-radius: 10px;
    background-color: var(--settings-background-secondary-color);
    box-shadow: var(--shadow-small-strong);
  }
  #settingsSearchEngine.darkModifier #defaultSearchEngine,
  #settingsSearchEngine.darkModifier #settingsLegacySearchEngine,
  #settingsSearchEngine.darkModifier #searchEngineOptions {
    background-color: var(--settings-background-secondary-color-dark);
    border: 1px solid var(--primary-color);
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 4px;
    border-radius: 10px;
    transition: 0.3s;
    background-color: var(--settings-background-secondary-color);
    box-shadow: var(--shadow-small-strong);
  }
  .item:hover {
    background-color: #f8faff !important;
  }
  .item p {
    margin: 0;
    margin-left: 8px;
  }
  .itemActive {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .itemActive:hover {
    background-color: #0c2;
  }
  .itemButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
    flex-shrink: 0;
  }
  .itemButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .itemButton:disabled {
    color: rgb(60, 60, 60);
    background-color: rgba(238, 218, 34, 0.4);
  }
  .openSettingsButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: var(--primary-color-text);
    background-color: var(--primary-color);
    transition: 0.3s;
  }
  .openSettingsButton:hover {
    background-color: var(--primary-color-hover);
  }
  .optionRow {
    display: grid;
    grid-template-columns: 1fr 2fr 140px;
    padding-top: 8px;
  }
  .optionRow::after {
    content: "";
    grid-column: 1 / -1;
    border-bottom: 1px solid var(--settings-background-color);
    margin-top: 8px;
  }
  #settingsSearchEngine.darkModifier .optionRow::after {
    border-bottom: 1px solid var(--primary-color);
  }
  .optionRow.header {
    font-weight: 500;
  }
  .optionRow p {
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .copyToClipboardButton,
  .openGuideButton {
    border: 0;
    cursor: pointer;
    color: var(--primary-color);
    background-color: transparent;
    transition: 0.3s;
  }
  .copyToClipboardButton:hover,
  .openGuideButton:hover {
    color: var(--primary-color-hover);
  }
</style>
