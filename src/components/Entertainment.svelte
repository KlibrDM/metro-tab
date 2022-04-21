<script>
  import { entertainmentData } from "../data/config";

  let isPanelShown = false;

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
  class:highZIndex={isPanelShown}
>
  <i class="fa-solid fa-gamepad" />
</button>

{#if isPanelShown}
  <div id="entertainmentPanel" transition:entertainmentEntrance>
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
    top: 2vh;
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
  #entertainmentPanel {
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
  #entertainmentTop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #entertainmentBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }
  #entertainmentBox > a {
    width: 85px;
  }
  #entertainmentBox > a > img {
    width: 100%;
  }
  #entertainmentBox > a > p {
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 0.8em;
    text-align: center;
    color: black;
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
