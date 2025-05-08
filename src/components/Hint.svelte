<script>
  import { userData } from "../store";

  let isPanelShown = false;
  let darkMode = false;

  userData.subscribe((data) => {
    darkMode = data.darkMode;
  });

  const hintsLength = 9;
  // Start from a random hint
  let hintIndex = Math.floor(Math.random() * hintsLength);

  const nextHint = () => {
    hintIndex = (hintIndex + 1) % hintsLength;
  };

  const prevHint = () => {
    hintIndex = (hintIndex - 1 + hintsLength) % hintsLength;
  };

  const toggleHintPanel = () => {
    isPanelShown = !isPanelShown;
  };

  //Transition
  function hintEntrance() {
    return {
      duration: 400,
      css: (t, u) => `clip-path: circle(${t * 130}% at 65% 3.5vh)`,
    };
  }
</script>

<button
  on:click={toggleHintPanel}
  id="hintButton"
  aria-label="Hints"
  class:highZIndex={isPanelShown}
  class:darkModifier={darkMode}
>
  <i class="fa-solid fa-info" />
</button>

{#if isPanelShown}
  <div id="hintPanel" class:darkModifier={darkMode} transition:hintEntrance>
    <div id="hintPanelTop">
      <h2>Hints</h2>
    </div>

    <div id="hint">
      <!-- Use hardcoded hints to easily display icons -->
      {#if hintIndex === 0}
        <span>You can change the background image by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Background" tab.</span>
      {:else if hintIndex === 1}
        <span>You can change visual settings such as tile size, border radius, and colors by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Visuals" tab.</span>
      {:else if hintIndex === 2}
        <span>You can add more pages to the speed dial by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Pages" tab.</span>
      {:else if hintIndex === 3}
        <span>You can group your pages into categories. You can create categories by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Categories" tab.</span>
      {:else if hintIndex === 4}
        <span>If you created categories, you can navigate to the "Pages" tab and select the category for each page by changing it from "Uncategorized" to any other category.</span>
      {:else if hintIndex === 5}
        <span>You can select a different theme by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Themes" tab.</span>
      {:else if hintIndex === 6}
        <span>You can search the web using the search bar at the top of the speed dial.</span>
      {:else if hintIndex === 7}
        <span>You can write notes by clicking on the <i class="fa-solid fa-note-sticky" /> icon in the top right corner.</span>
      {:else if hintIndex === 8}
        <span>You should create a backup of your data every once in a while. You can export your settings by clicking on the <i class="fas fa-sliders-h" /> icon in the top right corner and then navigating to the "Backup" tab.</span>
      {/if}
    </div>

    <div id="indicatorDots">
      {#each Array(hintsLength) as _, index}
        <span
          class="indicatorDot"
          class:active={index === hintIndex}
          on:click={() => (hintIndex = index)}
        ></span>
      {/each}
    </div>

    <div id="navigationButtons">
      <button on:click={prevHint}><i class="fa-solid fa-chevron-left" /></button>
      <button on:click={nextHint}><i class="fa-solid fa-chevron-right" /></button>
    </div>
  </div>
{/if}

<style>
  #hintButton {
    position: absolute;
    top: 20px;
    right: 145px;
    width: 30px;
    height: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
    z-index: 8;
  }
  #hintButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  #hintButton.darkModifier.highZIndex {
    background-color: rgba(255, 255, 255, 0.75);
    color: black;
  }
  #hintButton.darkModifier.highZIndex:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
  #hintPanel {
    padding: 20px 40px;
    position: absolute;
    background-color: white;
    right: 0;
    top: 0;
    z-index: 50;
    max-height: 100vh;
    width: 450px;
    overflow-y: auto;
    box-sizing: border-box;
  }
  #hintPanel.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
  }
  #hintPanelTop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #hint {
    padding: 8px 12px;
    border-radius: 8px;
    min-height: 90px;
    background-color: rgba(0, 0, 0, 0.07);
  }
  #hint i {
    margin-left: 4px;
    margin-right: 4px;
    font-size: 0.9em;
  }
  #hintPanel.darkModifier #hint {
    border: 1px solid #3a99ff;
    background-color: rgba(255, 255, 255, 0.07);
  }
  #indicatorDots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  .indicatorDot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
  .indicatorDot.active {
    background-color: rgba(0, 0, 0, 0.5);
  }
  #hintPanel.darkModifier .indicatorDot {
    background-color: rgba(255, 255, 255, 0.25);
  }
  #hintPanel.darkModifier .indicatorDot.active {
    background-color: rgba(255, 255, 255, 0.5);
  }
  #navigationButtons {
    display: flex;
    width: 100%;
    margin-top: 20px;
  }
  #navigationButtons button {
    flex: 1;
    padding: 8px 20px;
    border: 0;
    cursor: pointer;
    background-color: transparent;
    transition: 0.3s;
  }
  #navigationButtons button:hover {
    background-color: rgba(0, 0, 0, 0.07);
  }
  #hintPanel.darkModifier #navigationButtons button {
    color: white;
  }
  #hintPanel.darkModifier #navigationButtons button:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }
  .highZIndex {
    z-index: 60 !important;
  }
  @media screen and (max-width: 450px) {
    #hintPanel {
      width: 100vw;
      padding: 20px;
    }
  }
</style>
