<script>
  export let settingsData;
  export let deletePage;
  export let addPage;
  export let saveSettings;
  export let movePage;
  let unsavedPages = false;
  let addPageInput = ""; //Binded to input
</script>

<div id="settingsPages">
  <div id="settingsPagesList">
    {#each settingsData.pages as page, index}
      <div class="settingsPagesListPage">
        <div class="settingsPagesGroupLeft">
          <div class="settingsPagesMoveButtons">
            <button
              on:click={() => {
                movePage(index, "up");
                unsavedPages = true;
              }}
            >
              <i class="fa-solid fa-angle-up" />
            </button>
            <button
              on:click={() => {
                movePage(index, "down");
                unsavedPages = true;
              }}
            >
              <i class="fa-solid fa-angle-down" />
            </button>
          </div>
          <label for="page">{page.link}</label>
        </div>
        <div class="settingsPageListButtons">
          <input type="checkbox" name="page" bind:checked={page.isActive} />
          <input
            on:click={() => {
              deletePage(index);
              unsavedPages = true;
            }}
            type="button"
            class="pageDeleteButton"
            value="X"
          />
        </div>
      </div>
    {/each}
  </div>

  <form
    class="settingsPageInput"
    on:submit={(e) => {
      addPage(addPageInput, e);

      //Clear page input after adding it
      addPageInput = "";

      unsavedPages = true;
    }}
  >
    <label for="set_newPageBox">Link</label>
    <input
      type="text"
      id="set_newPageBox"
      class="settingsTextInput"
      bind:value={addPageInput}
      required={true}
    />
    <button type="submit" class="addPageButton">Add</button>
  </form>

  {#if unsavedPages}
    <small class="unsavedWarning">You have unsaved settings.</small>
  {/if}

  <button
    on:click={(e) => {
      saveSettings(settingsData, e);
      unsavedPages = false;
    }}
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
    transition: 0.3s;
  }
  .saveSettingsButton:hover {
    background-color: #0c2;
  }
  .addPageButton {
    padding: 4px 15px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  .addPageButton:hover {
    background-color: #0c2;
  }
  #settingsPages {
    background-color: rgb(245, 245, 245);
    border: 1px solid lightgray;
    padding: 8px 8px;
    border-radius: 20px;
    overflow-x: auto;
  }
  #settingsPagesList {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .settingsPagesListPage {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid lightgray;
  }
  .settingsPagesGroupLeft {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .settingsPagesListPage label {
    overflow-wrap: anywhere;
  }
  .settingsPagesMoveButtons {
    width: 14px;
    display: flex;
    flex-direction: column;
  }
  .settingsPagesMoveButtons button {
    width: inherit;
    height: 12px;
    font-size: 10px;
    padding: 0;
    border: 0;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .settingsPagesMoveButtons button:hover {
    background-color: rgb(238, 195, 25);
  }
  .settingsPagesMoveButtons button:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .settingsPagesMoveButtons button:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .settingsPageListButtons {
    align-self: center;
    display: flex;
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
    gap: 5px;
  }
  .settingsPageInput input {
    flex-grow: 1;
  }
  .unsavedWarning {
    display: block;
    color: red;
    margin-top: 8px;
  }
  @media screen and (max-width: 450px) {
    .settingsPageInput {
      flex-direction: column;
    }
  }
</style>
