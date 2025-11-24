<script>
  import { getTileImage } from "../../data/storage";
  import { clearOldExtension } from "../../data/tools";

  export let pages = [];
  export let categories = [];
  export let isShown = false;
  export let tileZoom;
  export let tileGrow;
  export let tileMinWidth;
  export let tileHeight;
  export let tileGap;
  export let tileBorder;
  export let tileBorderRadius;
  export let tileBorderColor;
  export let groupTileGap;
  export let groupTileBorderRadius;
  export let groupTileGrow;
  export let showSearchBar;
  export let showElementsShadow;
  export let useFrostedGlass;
  export let frostedGlassStrength;
  export let frostedGlassOpacity;
  export let frostedGlassColor;
  export let frostedGlassAccentColor;
</script>

<div class="speedDialBox" class:isShown={isShown} class:hiddenSearchBar={!showSearchBar} class:largePadding={categories.length}>
  <div class="buttons" style="gap: {tileGap}vh">
    {#if !pages.filter(page => page.isActive).length}
      <div class="noPagesAvailableWarning">
        No pages available in this category
      </div>
    {/if}
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
                ? 'background-image: url(' + (getTileImage(page.link) || '') + ');'
                : page.tileImageType !== 'none'
                  ? useFrostedGlass
                    ? ''
                    : 'background-image: url("static/images/thumbnails/' + clearOldExtension(page.imageName) + '.avif");'
                  : ''
              }
              {
                useFrostedGlass ? `
                  backdrop-filter: blur(${frostedGlassStrength}px);
                  -webkit-backdrop-filter: blur(${frostedGlassStrength}px);
                  background-color: rgba(${frostedGlassColor.r}, ${frostedGlassColor.g}, ${frostedGlassColor.b}, ${frostedGlassOpacity}) !important;
                `
                : ''
              }
              {showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
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
            {#if useFrostedGlass && (page.tileImageType === 'predefined' || (page.tileImageType === 'custom' && !getTileImage(page.link)))}
              <div
                class="frostedGlassIcon"
                style={`
                  background-color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
                  mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(page.imageName)}.webp");
                  ${tileHeight < tileMinWidth ? 'mask-size: 40% auto;' : 'mask-size: 70% auto;'}
              `}></div>
            {/if}
            {page.tileImageType === 'none' ? page.tileName : ''}
          </a>

        {:else if page.isGroup && page.pages.length > 0}

          <div class="pageGroup" style="
            gap: {page.pages.length <= 12 ? groupTileGap : groupTileGap / 2}vh;
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
                      ? 'background-image: url(' + (getTileImage(subpage.link) || '') + ');'
                      : subpage.tileImageType !== 'none'
                        ? useFrostedGlass
                          ? ''
                          : 'background-image: url("static/images/thumbnails/' + clearOldExtension(subpage.imageName) + '.avif");'
                        : ''
                    }
                    {
                      useFrostedGlass ? `
                        backdrop-filter: blur(${frostedGlassStrength}px);
                        -webkit-backdrop-filter: blur(${frostedGlassStrength}px);
                        background-color: rgba(${frostedGlassColor.r}, ${frostedGlassColor.g}, ${frostedGlassColor.b}, ${frostedGlassOpacity}) !important;
                      `
                      : ''
                    }
                    {showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
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
                  {#if useFrostedGlass && (subpage.tileImageType === 'predefined' || (subpage.tileImageType === 'custom' && !getTileImage(subpage.link)))}
                    <div
                      class="frostedGlassIcon"
                      style={`
                        background-color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
                        mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(subpage.imageName)}.webp");
                        ${tileHeight < tileMinWidth ? 'mask-size: 40% auto;' : 'mask-size: 70% auto;'}
                    `}></div>
                  {/if}
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

<style>
  .speedDialBox {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    padding-top: 2em;
    padding-bottom: 2em;
    box-sizing: border-box;
    width: 100%;
    flex-shrink: 0;
    transition: opacity 0s;
    opacity: 0;
    position: absolute;
    visibility: hidden;
    top: 0;
    height: 0;
    min-height: 0;
  }
  .speedDialBox.isShown {
    min-height: 75vh;
    height: unset;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.5s;
  }
  .speedDialBox.largePadding {
    padding-bottom: 48px;
  }
  .speedDialBox.hiddenSearchBar {
    min-height: calc(100vh - 140px);
  }
  .noPagesAvailableWarning {
    max-width: 400px;
    padding: 12px 24px;
    border-radius: 100px;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.25);
    color: white;
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
  .frostedGlassIcon {
    width: 100%;
    height: 100%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
</style>
