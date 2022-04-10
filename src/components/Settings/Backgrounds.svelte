<script>
  export let backgrounds;
  export let changeBackground;
</script>

<div id="settingsBackgrounds">
  {#each backgrounds as bg, index}
    <img
      src="static/images/bg/{bg}.jpg"
      alt="Background {index}"
      class="backgroundImageSelector"
      on:click={() => changeBackground(bg)}
    />
  {/each}
</div>
<small>
  Background images provided by <a href="https://pixabay.com/">Pixabay</a>
</small>

<style>
  #settingsBackgrounds {
    max-width: 300px;
    white-space: nowrap;
    overflow-x: scroll;
    display: flex;
    gap: 3px;
  }
  .backgroundImageSelector {
    max-width: 100px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
