<script>
  import { searchEngineList } from "../../data/config";

  export let currentSearchEngine;
  export let changeSearchEngine;
  export let darkMode;
</script>

<h2>Search Engine</h2>
<div id="settingsSearchEngine">
  <div id="itemList">
    {#each searchEngineList as searchEngine}
      <div class="item" class:darkModifier={darkMode}>
        <p>{searchEngine.label}</p>
        {#if currentSearchEngine === searchEngine.name}
          <button disabled class="itemActive">Active</button>
        {:else}
          <button
            class="itemButton"
            on:click={() => {
              currentSearchEngine = searchEngine.name;
              changeSearchEngine(searchEngine.name)
            }}
          >
            Set as active
          </button>
        {/if}
      </div>
    {/each}
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
    overflow-y: auto;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 4px;
    border-radius: 10px;
    border: 1px solid lightgray;
  }
  .item.darkModifier {
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
  }
  .itemButton:hover {
    background-color: rgb(238, 195, 25);
  }
</style>
