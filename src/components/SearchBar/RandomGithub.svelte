<script>
  let showGithub = false;

  //innerWidth will get the window innerWidth
  let innerWidth = 0;

  setInterval(function () {
    let chance = Math.floor(Math.random() * 200);

    //Only show github logo if random chance matches
    //and window width is bigger than 799 pixels
    if (chance === 1 && innerWidth > 799) {
      showGithub = true;
    } else {
      showGithub = false;
    }
  }, 15000);
</script>

<svelte:window bind:innerWidth />

{#if showGithub}
  <div id="randomGithub">
    <a href="https://github.com/KlibrDM">
      <i class="fab fa-github" style="color: white" />
    </a>
  </div>
{/if}

<style>
  #randomGithub {
    position: absolute;
    left: 2vw;
    font-size: 3vw;
    animation: wobble-hor-bottom 0.8s infinite;
  }
  @media screen and (max-width: 799px) {
    #randomGithub {
      display: none;
    }
  }
</style>
