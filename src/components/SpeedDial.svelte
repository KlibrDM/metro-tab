<script>
  import { getTileImage } from "../data/storage";
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
  let groupTileGap;
  let groupTileBorderRadius;
  let groupTileGrow;

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
    groupTileGap = data.groupTileGap;
    groupTileBorderRadius = data.groupTileBorderRadius;
    groupTileGrow = data.groupTileGrow;
  });
</script>

<!--This will show the pages!!!-->
<div class="speedDial">
  <div class="speedDialBox">
    <div class="buttons" style="gap: {tileGap}vh">
      {#each pages as page}
        {#if page.isActive}
          {#if !page.isGroup}

            <!-- svelte-ignore a11y-missing-content -->
            <a
              href={page.link}
              class="pageButton"
              aria-label={page.link}
              style="{
                  page.tileImageType === 'custom' && getTileImage(page.link)
                  ? 'background-image: url(' + (getTileImage(page.link) || '') + ')'
                  : page.tileImageType !== 'none'
                    ? 'background-image: url("static/images/thumbnails/' + clearOldExtension(page.imageName) + '.avif")'
                    : ''
                };
                background-color: {page.backgroundColor};
                color: {page.textColor};
                font-size: {tileMinWidth / (page.tileName.length * 0.8 <= 1.8 ? 1.8 : page.tileName.length * 0.8)}vh;
                flex-grow: {tileGrow ? 1 : 0};
                min-width: {tileMinWidth}vh;
                height: {tileHeight}vh;
                border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
                border-radius: {tileBorderRadius}vh;
                {tileHeight < tileMinWidth ? 'background-size: 180% auto;' : ''}
                {!tileZoom ? "animation: none !important" : ''}
                "
            >
              {page.tileImageType === 'none' ? page.tileName : ''}
            </a>

          {:else if page.isGroup && page.pages.length > 0}

            <div class="pageGroup" style="
              gap: {groupTileGap}vh;
              flex-grow: {tileGrow ? 1 : 0};
              min-width: {tileMinWidth}vh;
              height: {tileHeight}vh;
              {!groupTileGrow ? 'display: grid;' : 'display: flex; flex-wrap: wrap;'}
              {!groupTileGrow ? `
                grid-template-columns: ${
                tileMinWidth < tileHeight
                  ? page.pages.length <= 2
                    ? "1fr"
                    : page.pages.length <= 6
                      ? "1fr 1fr"
                      : page.pages.length <= 12
                        ? "1fr 1fr 1fr"
                        : "1fr 1fr 1fr 1fr"
                  : page.pages.length === 1
                    ? "1fr"
                    : page.pages.length === 2 && tileMinWidth - tileHeight < tileMinWidth / 4
                      ? "1fr"
                      : page.pages.length <= 3
                        ? "1fr 1fr"
                        : page.pages.length <= 9
                          ? "1fr 1fr 1fr"
                          : page.pages.length <= 12
                            ? "1fr 1fr 1fr 1fr"
                            : "1fr 1fr 1fr 1fr 1fr"
                };
              ` : ''}
            ">
              {#each page.pages as subpage}
                {#if subpage.isActive}
                  <a
                    href={subpage.link}
                    class="pageButton"
                    aria-label={subpage.link}
                    style="{
                        subpage.tileImageType === 'custom' && getTileImage(subpage.link)
                        ? 'background-image: url(' + (getTileImage(subpage.link) || '') + ')'
                        : subpage.tileImageType !== 'none'
                          ? 'background-image: url("static/images/thumbnails/' + clearOldExtension(subpage.imageName) + '.avif")'
                          : ''
                      };
                      background-color: {subpage.backgroundColor};
                      color: {subpage.textColor};
                      font-size: {
                        tileMinWidth
                        / (subpage.tileName.length * 0.8 <= 1.8 ? 1.8 : subpage.tileName.length * 0.8)
                        / (
                          page.pages.length <= 2
                          ? 1.5
                          : page.pages.length <= 9
                            ? 2.5
                            : page.pages.length <= 12
                              ? 3.2
                              : 4.2
                        )
                      }vh;
                      border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
                      border-radius: {groupTileBorderRadius}vh;
                      min-width: 40px;
                      {tileHeight < tileMinWidth ? 'background-size: 180% auto;' : ''}
                      {!tileZoom ? "animation: none !important;" : ''}
                      {groupTileGrow ? `
                        flex-grow: 1;
                        flex-basis: ${
                          tileMinWidth < tileHeight
                          ? page.pages.length <= 2
                            ? "100%"
                            : page.pages.length <= 6
                              ? "40%"
                              : page.pages.length <= 12
                                ? "28%"
                                : "21%"
                          : page.pages.length === 2 && tileMinWidth - tileHeight < tileMinWidth / 4
                            ? "100%"
                            : page.pages.length <= 3
                              ? "40%"
                              : page.pages.length <= 9
                                ? "28%"
                                : page.pages.length <= 12
                                  ? "21%"
                                  : "15%"
                        };
                      ` : ''}
                  ">
                    {subpage.tileImageType === 'none' ? subpage.tileName : ''}
                  </a>
                {/if}
              {/each}
            </div>

          {/if}
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
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-width: 180px;
    background-position: center;
    background-size: cover;
    z-index: 0;
    flex-basis: 0;
    line-height: 0;
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
  .pageGroup {
    flex-basis: 0;
    line-height: 0;
  }
</style>
