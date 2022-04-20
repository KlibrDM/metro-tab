<script>
  import CustomBackgrounds from "./CustomBackgrounds.svelte";

  export let backgrounds;
  export let changeBackground;
</script>

<div id="settingsBackgrounds">
  {#each backgrounds as bg, index}
    <img
      src="static/images/bg/thumbnails/{bg}.jpg"
      alt="Background {index}"
      class="backgroundImageSelector"
      on:click={() => changeBackground(bg)}
    />
  {/each}
</div>
<small>
  Background images provided by <a href="https://pixabay.com/">Pixabay</a>
</small>
<CustomBackgrounds {changeBackground} />

<style>
  #settingsBackgrounds {
    white-space: nowrap;
    overflow-x: scroll;
    display: flex;
    gap: 3px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .backgroundImageSelector {
    max-width: 100px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .backgroundImageSelector:hover {
    filter: drop-shadow(0px 0px 2px rgb(80, 80, 80));
    transform: scale(1.03);
    z-index: 2;
  }
</style>
