<script>
  import { searchEngineList } from "../../data/config";

  export let settingsData;
  export let changeSearchEngine;

  let customSearchEngineUrlInput = settingsData.customSearchEngineUrl || "";
  let inputModified = false;
</script>

<h2>Search Engine</h2>
<div id="settingsSearchEngine" class:darkModifier={settingsData.darkMode}>
  <div id="itemList">
    {#each searchEngineList as searchEngine}
      <div class="item">
        <p>{searchEngine.label}</p>
        {#if settingsData.searchEngine === searchEngine.name}
          <button disabled class="itemActive">Active</button>
        {:else}
          <button
            class="itemButton"
            on:click={() => {
              settingsData.searchEngine = searchEngine.name;
              changeSearchEngine(searchEngine.name)
            }}
          >
            Set as active
          </button>
        {/if}
      </div>
    {/each}
  </div>

  <div id="customSearchEngine">
    <h2>Custom Search Engine</h2>
    <div class="item">
      <input
        type="text"
        id="set_engineLinkBox"
        class="customSearchEngineInput"
        bind:value={customSearchEngineUrlInput}
        placeholder="Type the custom search engine URL"
        maxlength="500"
        on:input={() => {
          inputModified = true;
        }}
      />
      {#if settingsData.searchEngine === "custom"}
        <button disabled class="itemActive">Active</button>
      {:else}
        <button
          class="itemButton"
          disabled={customSearchEngineUrlInput.length === 0 || customSearchEngineUrlInput.indexOf("%s") === -1 || (customSearchEngineUrlInput.substring(0, 7) !== "http://" && customSearchEngineUrlInput.substring(0, 8) !== "https://")}
          on:click={() => {
            settingsData.searchEngine = "custom";
            settingsData.customSearchEngineUrl = customSearchEngineUrlInput;
            changeSearchEngine("custom", customSearchEngineUrlInput);
            inputModified = false;
          }}
        >
          {inputModified ? "Save and set as active" : "Set as active" }
        </button>
      {/if}
    </div>
    <p>Use %s in URL in place of query (e.g. https://www.google.com/search?q=%s)</p>
    <div class="settingsActionButtons">
      <div class="settingsActionButtonWithError">
        <button
          on:click={() => {
            settingsData.customSearchEngineUrl = customSearchEngineUrlInput;
            changeSearchEngine(settingsData.searchEngine, customSearchEngineUrlInput);
            inputModified = false;
          }}
          disabled={customSearchEngineUrlInput.length > 0 && (customSearchEngineUrlInput.indexOf("%s") === -1 || (customSearchEngineUrlInput.substring(0, 7) !== "http://" && customSearchEngineUrlInput.substring(0, 8) !== "https://"))}
          type="submit"
          class="saveSettingsButton"
        >
          Save URL
        </button>
        {#if inputModified}
          <small class="unsavedWarning">
            {
              customSearchEngineUrlInput.length > 0 && (customSearchEngineUrlInput.indexOf("%s") === -1 || (customSearchEngineUrlInput.substring(0, 7) !== "http://" && customSearchEngineUrlInput.substring(0, 8) !== "https://"))
              ? "Invalid URL format"
              : "You have unsaved changes to the URL"
            }
          </small>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
  }
  #itemList {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 4px;
    border-radius: 10px;
    border: 1px solid lightgray;
  }
  #settingsSearchEngine.darkModifier .item {
    border-color: #3a99ff;
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
    background-color: rgb(238, 195, 25);
  }
  .itemButton:disabled {
    color: rgb(60, 60, 60);
    background-color: rgba(238, 218, 34, 0.4);
  }
  #customSearchEngine p {
    margin-top: 6px;
    margin-bottom: 0;
  }
  .customSearchEngineInput {
    width: 100%;
    border: 0;
    overflow-wrap: anywhere;
    background-color: transparent;
    margin-left: 8px;
    margin-right: 8px;
    outline: none;
    font-size: 1.1em;
  }
  #settingsSearchEngine.darkModifier .customSearchEngineInput {
    color: white;
  }
  .settingsActionButtons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
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
  .saveSettingsButton:disabled {
    color: white;
    background-color: rgba(27, 155, 31, 0.4);
  }
  #settingsSearchEngine.darkModifier .saveSettingsButton:disabled {
    color: rgb(140, 140, 140);
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
</style>
