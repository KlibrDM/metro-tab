<script>
  import { userData } from "../store";

  let yourName;
  let showCover;
  let coverColor;
  let coverTextColor;

  userData.subscribe((data) => {
    yourName = data.yourName;
    showCover = data.showCover;
    coverColor = data.coverColor;
    coverTextColor = data.coverTextColor;
  });

  //Creating a second variable for showCover
  //that doesn't change when state updates
  //Otherwise the cover would show when saving changes
  let showCoverAtLoad = showCover;

  //Any time showCoverAtLoad changes (it shouldn't)
  //Hide it after 1.5 seconds
  $: if (showCoverAtLoad) {
    setTimeout(function () {
      showCoverAtLoad = false;
    }, 1500);
  }
</script>

{#if showCoverAtLoad}
  <div
    id="cover"
    style="
      background-color: 
        rgb({coverColor.r},{coverColor.g},{coverColor.b}); 
      color: 
        rgb({coverTextColor.r},{coverTextColor.g},{coverTextColor.b});"
  >
    <div id="coverNameBox">
      <h1>{yourName}</h1>
    </div>
  </div>
{/if}

<style>
  #cover {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: remove-cover-up 0.35s;
    animation-fill-mode: forwards;
    animation-delay: 0.8s;
    z-index: 995;
  }
  #coverNameBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  #coverNameBox h1 {
    font-size: 9vw;
    font-weight: 500;
    animation: title-disappear 0.35s;
    animation-delay: 0.35s;
    animation-fill-mode: forwards;
    z-index: 999;
    text-align: center;
    user-select: none;
  }
</style>
