<script>
  import Tooltip from "../Tooltip.svelte";

  export let settingsData;
  export let saveSettings;
  export let resetBehavior;
  export let unsavedSettings;

  // Show reset to default confirm after reset button was clicked
  let showResetToDefaultConfirm = false;
</script>

<form
  id="settingsForm"
  class:darkModifier={settingsData.darkMode}
  on:submit={(e) => {
    saveSettings(settingsData, e);
    unsavedSettings = false;
  }}
>
  <div class="settingsFormContainer">
    <div class="settingsFormGroup">
      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/b_open_page_in_new_tab.webp" alt="Set open pages in new tab" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_openPageInNewTab">Open pages in new tab</label>
          <input
            type="checkbox"
            id="set_openPageInNewTab"
            name="set_openPageInNewTab"
            class="settingsCheckbox"
            bind:checked={settingsData.openPageInNewTab}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Toggle whether to open pages in a new tab.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/b_open_search_in_new_tab.webp" alt="Set open search results in new tab" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_openSearchInNewTab">Open search results in new tab</label>
          <input
            type="checkbox"
            id="set_openSearchInNewTab"
            name="set_openSearchInNewTab"
            class="settingsCheckbox"
            bind:checked={settingsData.openSearchInNewTab}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip text="Toggle whether to open search results in a new tab.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/b_category_switch_buttons.webp" alt="Set show category switch buttons" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_categorySwitchButtons">Show category switch buttons</label>
          <input
            type="checkbox"
            id="set_categorySwitchButtons"
            name="set_categorySwitchButtons"
            class="settingsCheckbox"
            bind:checked={settingsData.categorySwitchButtons}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip maxWidth="600" text="Toggle whether to show buttons on the side of the screen to navigate between categories. These buttons will be shown only if you are using categories.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/b_category_bar_scroll.webp" alt="Set scroll on category bar" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_categoryBarScroll">Scroll on category bar</label>
          <input
            type="checkbox"
            id="set_categoryBarScroll"
            name="set_categoryBarScroll"
            class="settingsCheckbox"
            bind:checked={settingsData.categoryBarScroll}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <Tooltip maxWidth="600" text="Toggle whether to enable scrolling on the category bar to navigate between categories. This option will work only if you are using categories.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>

      <div class="settingsInput">
        <div class="imagePlaceholder">
          <img src="static/images/settings/b_category_swipe_navigation.webp" alt="Set swipe to navigate categories" />
        </div>
        <hr/>
        <div class="settingsInputGroup">
          <label for="set_categorySwipeNavigation">Swipe to navigate categories</label>
          <input
            type="checkbox"
            id="set_categorySwipeNavigation"
            name="set_categorySwipeNavigation"
            class="settingsCheckbox"
            bind:checked={settingsData.categorySwipeNavigation}
            on:input={() => {
              unsavedSettings = true;
            }}
          />
        </div>
        <div class="settingsFormHintContainer">
          <i class="fa-solid fa-laptop" />
          <Tooltip maxWidth="600" text="Toggle whether to enable trackpad swiping on the page to navigate between categories. This option will work only if you are using categories. You must have a device with a trackpad, such as a laptop, or a mouse that supports horizontal scrolling. You might need to disable browser gestures as they can interfere with this feature.">
            <i class="fa-solid fa-circle-info hintIcon" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>

  <div class="settingBottomSection">
    <div class="settingsButtonWithError">
      <button type="submit" class="saveSettingsButton">Save</button>

      {#if unsavedSettings}
        <small class="unsavedWarning">You have unsaved settings.</small>
      {/if}
    </div>

    <div class="resetToDefaultContainer">
      <button
        class={showResetToDefaultConfirm ? 'resetToDefaultQuestion' : 'resetToDefaultButton'}
        on:click={() => {showResetToDefaultConfirm = true}}
      >
        {#if showResetToDefaultConfirm}
          Are you sure?
        {:else}
          Reset to default settings
        {/if}
      </button>

      {#if showResetToDefaultConfirm}
        <button
          class="resetToDefaultConfirmButton"
          on:click={() => {
            resetBehavior();
            unsavedSettings = false;
            showResetToDefaultConfirm = false;
          }}
        >
          Yes
        </button>
        <button
          class="resetToDefaultCancelButton"
          on:click={() => {showResetToDefaultConfirm = false}}
        >
          No
        </button>
      {/if}
    </div>
  </div>
</form>

<style>
  hr {
    width: 90%;
    border: 0;
    border-top: 1px solid lightgray;
  }
  #settingsForm.darkModifier hr {
    border-color: #3a99ff;
  }
  #settingsForm {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .settingsFormContainer {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    padding: 20px;
  }
  .settingsFormGroup {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 12px;
  }
  .settingsInput {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    position: relative;
    background-color: var(--settings-background-secondary-color);
    box-shadow: var(--shadow-small-strong);
  }
  #settingsForm.darkModifier .settingsInput {
    border: 1px solid var(--primary-color);
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsFormHintContainer {
    position: absolute;
    top: 6px;
    right: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hintIcon {
    color: #3a99ff;
  }
  .imagePlaceholder {
    width: 250px;
    min-height: 125px;
  }
  .settingsInput img {
    width: 250px;
    display: block;
  }
  .settingsInputGroup {
    display: flex;
    justify-content: space-between;
    padding: 0px 15px 10px 15px;
    width: calc(100% - 30px);
  }
  .settingsInput label {
    margin-right: 10px;
    margin-bottom: 0;
  }
  .settingsInput input:out-of-range {
    background-color: rgba(255, 0, 0, 0.15);
  }
  .settingsCheckbox {
    width: 18px;
    height: 18px;
  }
  .settingBottomSection{
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 20px 20px;
    background-color: var(--settings-background-secondary-color);
    box-shadow: var(--shadow-small-subtle-up);
    z-index: 1;
    margin-top: auto;
  }
  #settingsForm.darkModifier .settingBottomSection {
    background-color: var(--settings-background-secondary-color-dark);
  }
  .settingsButtonWithError {
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
  .resetToDefaultContainer {
    margin-top: 8px;
  }
  .resetToDefaultButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: #000;
    background-color: #fff;
    transition: 0.3s;
  }
  .resetToDefaultButton:hover {
    background-color: #f3f3f3;
  }
  .resetToDefaultQuestion,
  .resetToDefaultCancelButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: #000;
    background-color: rgb(220, 220, 220);
    transition: 0.3s;
  }
  .resetToDefaultQuestion:hover,
  .resetToDefaultCancelButton:hover {
    background-color: rgb(200, 200, 200);
  }
  .resetToDefaultConfirmButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: rgb(210, 40, 40);
    transition: 0.3s;
  }
  .resetToDefaultConfirmButton:hover {
    background-color: rgb(180, 30, 30);
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
