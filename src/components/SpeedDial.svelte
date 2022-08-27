<script>
  import { clearOldExtension } from "../data/tools";
  import { userData } from "../store";

  let pages = [];
  let tileZoom;
  let tileGrow;
  let tileMinWidth;
  let tileHeight;
  let tileGap;
  let tileBorder;
  let tileBorderRadius;
  let tileBorderColor;

  userData.subscribe((data) => {
    pages = data.pages;
    tileZoom = data.tileZoom;
    tileGrow = data.tileGrow;
    tileMinWidth = data.tileMinWidth;
    tileHeight = data.tileHeight;
    tileGap = data.tileGap;
    tileBorder = data.tileBorder;
    tileBorderRadius = data.tileBorderRadius;
    tileBorderColor = data.tileBorderColor;
  });
</script>

<!--This will show the pages!!!-->
<div class="speedDial">
  <div class="speedDialBox">
    <div class="buttons" style="gap: {tileGap}vw">
      {#each pages as page}
        {#if page.isActive}
          <!-- svelte-ignore a11y-missing-content -->
          <a
            href={page.link}
            class="pageButton"
            aria-label={page.link}
            style="background-image: url('static/images/thumbnails/{clearOldExtension(page.imageName)}.avif');
              flex-grow: {tileGrow ? 1 : 0};
              min-width: {tileMinWidth}vh;
              height: {tileHeight}vh;
              border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
              border-radius: {tileBorderRadius}vh;
              {tileHeight < tileMinWidth ? 'background-size: 180% auto;' : ''}
              {!tileZoom ? "animation: none !important" : ''}
              "
          />
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .speedDialBox {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 75vh;
    overflow-x: hidden;
    padding-top: 2em;
    padding-bottom: 2em;
    box-sizing: border-box;
  }
  .buttons {
    width: 75vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    gap: 0px;
  }
  .pageButton {
    min-width: 180px;
    background-position: center;
    background-size: cover;
    z-index: 0;
    box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);
  }
  .pageButton:hover {
    animation: pop-out 0.25s;
    animation-fill-mode: forwards;
    z-index: 2;
  }
  .pageButton:not(:hover) {
    animation: pop-back 0.25s;
    animation-fill-mode: forwards;
    z-index: 1;
    transition: z-index 0.25s;
  }
</style>
