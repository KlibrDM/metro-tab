<script>
  export let settingsData;
  export let deletePage;
  export let addPage;
  export let saveSettings;
  let addPageInput = ""; //Binded to input
</script>

<div id="settingsPages">
  <div id="settingsPagesList">
    {#each settingsData.pages as page, index}
      <div class="settingsPagesListPage">
        <label for="page">{page.link}</label>
        <div class="settingsPageListButtons">
          <input type="checkbox" name="page" bind:checked={page.isActive} />
          <input
            on:click={() => deletePage(index)}
            type="button"
            class="pageDeleteButton"
            value="X"
          />
        </div>
      </div>
    {/each}
  </div>

  <form class="settingsPageInput">
    <label for="set_newPageBox">Add</label>
    <input
      type="text"
      id="set_newPageBox"
      class="settingsTextInput"
      bind:value={addPageInput}
    />
    <button
      on:click={(e) => addPage(addPageInput, e)}
      type="submit"
      class="addPageButton"
    >
      Add
    </button>
  </form>

  <button
    on:click={(e) => saveSettings(settingsData, e)}
    type="submit"
    class="saveSettingsButton"
  >
    Save
  </button>
</div>

<style>
  .settingsTextInput {
    padding: 3px 5px;
    border-radius: 10px;
    border: 1px solid gray;
  }
  .saveSettingsButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
  }
  .addPageButton {
    padding: 4px 15px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
  }
  #settingsPages {
    background-color: rgb(240, 240, 240);
    border: 1px solid lightgray;
    padding: 7px 12px;
    border-radius: 20px;
    max-width: 300px;
    overflow-x: auto;
  }
  .settingsPagesListPage {
    display: flex;
    justify-content: space-between;
  }
  .settingsPagesListPage label {
    overflow-wrap: anywhere;
  }
  .settingsPageListButtons {
    min-width: 45px;
    align-self: center;
  }
  .pageDeleteButton {
    border: 0;
    background-color: transparent;
    color: red;
    cursor: pointer;
  }
  .settingsPageInput {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .settingsPageInput input {
    flex-grow: 1;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
