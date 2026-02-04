<script>
  import { compressImage } from "../../data/tools";
  import Tooltip from "../Tooltip.svelte";

  export let changeBackground;
  let bg;
  let fileInput;
  let compressionQuality = 75;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      bg = e.target.result;
      const quality = compressionQuality < 50 || compressionQuality > 90 ? 75 : compressionQuality;
      compressImage(bg, 3840, 3840, quality).then((compressedBg) => {
        changeBackground(compressedBg);
        fileInput.value = null;
      });
    };
  };
</script>

<div id="customBackgrounds">
  <h4>Custom background image</h4>
  <button
    on:click={() => {
      fileInput.click();
    }}
  >
    Upload image
  </button>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png, .webp, .avif"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileInput}
  />
  <div class="backgroundQualityContainer">
    <label for="set_backgroundQuality">
      Custom background quality
      <Tooltip
        text="Adjust the compression level for custom background images. A higher quality results in better image fidelity but more storage space used. Quality 75 is a good balance between quality and file size. This must be adjusted before uploading an image."
        maxWidth={420}
      >
        <i class="fa-solid fa-circle-info hintIcon" />
      </Tooltip>
    </label>
    <div class="settingsNumberSliderGroup">
      <input
        type="range"
        min="50"
        max="90"
        step="1"
        class="settingsSlider"
        bind:value={compressionQuality}
      />
      <input
        type="number"
        min="50"
        max="90"
        step="1"
        class="settingsNumberInput"
        id="set_backgroundQuality"
        name="set_backgroundQuality"
        bind:value={compressionQuality}
      />
    </div>
    {#if compressionQuality < 50 || compressionQuality > 90}
      <small>Value must be between 50 and 90 (defaulting to 75)</small>
    {/if}
  </div>
</div>

<style>
  h4 {
    margin-block-start: 0.8em;
    margin-block-end: 0.2em;
  }
  button {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  button:hover {
    background-color: rgb(230, 200, 22);
  }
  label {
    display: flex;
    gap: 8px;
  }
  .backgroundQualityContainer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 320px;
    margin-top: 8px;
  }
  .settingsNumberSliderGroup {
    display: flex;
    gap: 4px;
  }
  .settingsNumberInput {
    padding: 3px 5px;
    border-radius: 5px;
    border: 1px solid gray;
    width: 40px;
  }
  .hintIcon {
    color: #3a99ff;
  }
</style>
