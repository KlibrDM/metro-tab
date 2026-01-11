<script>
  import { entertainmentData } from "../data/config";
  import { userData } from "../store";

  let isPanelShown = false;
  let darkMode = false;

  userData.subscribe((data) => {
    darkMode = data.darkMode;
  });

  const toggleEntertainmentPanel = () => {
    isPanelShown = !isPanelShown;
  };

  //Transition
  function entertainmentEntrance() {
    return {
      duration: 400,
      css: (t, u) => `clip-path: circle(${t * 130}% at 74% 3.5vh)`,
    };
  }
</script>

<button
  on:click={toggleEntertainmentPanel}
  id="entertainmentButton"
  aria-label="Entertainment"
  class:highZIndex={isPanelShown}
  class:darkModifier={darkMode}
>
  <i class="fa-solid fa-gamepad" />
</button>

{#if isPanelShown}
  <div id="entertainmentPanel" class:darkModifier={darkMode} transition:entertainmentEntrance>
    <div id="entertainmentTop">
      <h2>Entertainment</h2>
    </div>

    <div id="entertainmentBox">
      {#each entertainmentData as data}
        <a href={data.link}>
          <img src="static/images/entertainment/{data.img}" alt={data.name} />
          <p>{data.name}</p>
        </a>
      {/each}
    </div>
  </div>
{/if}

<style>
  #entertainmentButton {
    position: absolute;
    top: 20px;
    right: 105px;
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
  #entertainmentButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  #entertainmentButton.darkModifier.highZIndex {
    background-color: rgba(255, 255, 255, 0.75);
    color: black;
  }
  #entertainmentButton.darkModifier.highZIndex:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
  #entertainmentPanel {
    padding: 20px 40px 30px 40px;
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
  #entertainmentPanel.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
  }
  #entertainmentTop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #entertainmentBox {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    column-gap: 16px;
    row-gap: 8px;
  }
  #entertainmentBox > a {
    width: 80px;
    height: fit-content;
  }
  #entertainmentBox > a > img {
    width: 100%;
  }
  #entertainmentPanel.darkModifier #entertainmentBox > a > img {
    border: 2px solid white;
    border-radius: 8px;
  }
  #entertainmentBox > a > p {
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 0.8em;
    text-align: center;
    color: black;
  }
  #entertainmentPanel.darkModifier #entertainmentBox > a > p {
    color: white;
  }
  .highZIndex {
    z-index: 60 !important;
  }
  @media screen and (max-width: 450px) {
    #entertainmentPanel {
      width: 100vw;
      padding: 20px;
    }
  }
</style>
