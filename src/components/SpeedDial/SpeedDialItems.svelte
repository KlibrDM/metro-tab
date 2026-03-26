<script>
  import { getTileImage } from "../../data/storage";
  import { clearOldExtension, toHexAlpha } from "../../data/tools";

  export let pages = [];
  export let categories = [];
  export let openQuickAdd;
  export let isShown = false;
  export let tileZoom;
  export let tileGrow;
  export let tileSafeZone;
  export let tileMinWidth;
  export let tileHeight;
  export let tileGap;
  export let tileBorder;
  export let tileBorderRadius;
  export let tileBorderColor;
  export let groupTileGap;
  export let groupTileBorderRadius;
  export let groupTileGrow;
  export let navbarCompact;
  export let showSearchBar;
  export let showPageQuickAdd;
  export let showElementsShadow;
  export let useFrostedGlass;
  export let frostedGlassStrength;
  export let frostedGlassOpacity;
  export let frostedGlassColor;
  export let frostedGlassAccentColor;

  const getActivePagesCountInGroup = (group) => {
    return group.pages.filter(page => page.isActive).length;
  }
</script>

<div
  class="speedDialBox"
  class:isShown={isShown}
  class:hiddenSearchBar={!showSearchBar}
  class:compactNavbar={navbarCompact}
  class:largePadding={categories.length}
  style={
    useFrostedGlass
      ? "transition: none !important;"
      : ""
  }
>
  <div
    class="buttons"
    style={`
      gap: ${tileGap}vh;
      width: calc(100% - ${tileSafeZone}%);
    `}
  >
    {#if !showPageQuickAdd && !pages.filter(page => page.isActive).length}
      <div
        class="noPagesAvailableWarning"
        style={`
          ${
            useFrostedGlass
              ? `
                color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
                border: none;
                backdrop-filter: blur(${frostedGlassStrength}px);
                -webkit-backdrop-filter: blur(${frostedGlassStrength}px);
                background-color: rgba(${frostedGlassColor.r}, ${frostedGlassColor.g}, ${frostedGlassColor.b}, ${frostedGlassOpacity}) !important;
              `
              : ''
          }
          ${showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
        `}
      >
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
            style="
              {
                page.tileImageType === 'custom' && getTileImage(page.link)
                ? `
                  background-image: url(${(getTileImage(page.link) || '')});
                  background-position: ${page.imagePositionX !== undefined ? page.imagePositionX : 50}% ${page.imagePositionY !== undefined ? page.imagePositionY : 50}%;
                  background-size: auto ${page.imageZoom || 125}% !important;
                  background-repeat: no-repeat;
                `
                : page.tileImageType === 'icon'
                  ? ''
                  : page.tileImageType !== 'none' // Keep !== none logic in order to have a fallback to the predefined image
                    ? useFrostedGlass || page.useCustomColors
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
              {
                page.useCustomColors ? `
                  background-color: ${page.backgroundColor}${useFrostedGlass ? toHexAlpha(frostedGlassOpacity) : ''} !important;
                `
                : ''
              }
              {showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
              background-color: {page.backgroundColor};
              color: {useFrostedGlass && !page.useCustomColors ? `rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b})` : page.textColor};
              font-size: {
                tileMinWidth / (
                  (page.tileImageType === 'icon' ? 1 : page.tileName.length) * 0.8 <= 1.8
                  ? 1.8
                  : (page.tileImageType === 'icon' ? 1 : page.tileName.length) * 0.8
                )
              }vh;
              flex-grow: {tileGrow ? 1 : 0};
              min-width: {tileMinWidth}vh;
              height: {tileHeight}vh;
              border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
              border-radius: {tileBorderRadius}vh;
              {tileHeight <= tileMinWidth ? 'background-size: 180% auto;' : ''}
              {!tileZoom ? "animation: none !important" : ''}
            "
          >
            {#if (useFrostedGlass || page.useCustomColors) && (page.tileImageType === 'predefined' || (page.tileImageType === 'custom' && !getTileImage(page.link)))}
              <div
                class="frostedGlassIcon"
                style={`
                  ${page.useCustomColors ? `
                    background-color: ${page.textColor};
                  ` : `
                    background-color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
                  `}
                  border-radius: ${tileBorderRadius}vh;
                  mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(page.imageName)}.webp");
                  ${tileHeight <= tileMinWidth ? 'mask-size: 40% auto;' : 'mask-size: 65% auto;'}
                `}
              ></div>
            {/if}
            {page.tileImageType === 'none' ? page.tileName : ''}
            {#if page.tileImageType === 'icon' }
              <i
                class={`fa-solid fa-${page.iconName}`}
                style={`font-size: ${tileHeight <= tileMinWidth ? 60 : 90}%; line-height: 2px;`}
              ></i>
            {/if}
          </a>

        {:else if page.isGroup && getActivePagesCountInGroup(page) > 0}

          <div class="pageGroup" style="
            gap: {getActivePagesCountInGroup(page) <= 12 ? groupTileGap : groupTileGap / 2}vh;
            flex-grow: {tileGrow ? 1 : 0};
            min-width: {tileMinWidth}vh;
            height: {tileHeight}vh;
            {!groupTileGrow ? 'display: grid;' : 'display: flex; flex-wrap: wrap;'}
            {!groupTileGrow ? `
              grid-template-columns: ${
              tileMinWidth < tileHeight
                ? getActivePagesCountInGroup(page) <= 2
                  ? "1fr"
                  : getActivePagesCountInGroup(page) <= 6
                    ? "1fr 1fr"
                    : getActivePagesCountInGroup(page) <= 12
                      ? "1fr 1fr 1fr"
                      : "1fr 1fr 1fr 1fr"
                : getActivePagesCountInGroup(page) === 1
                  ? "1fr"
                  : getActivePagesCountInGroup(page) === 2 && tileMinWidth - tileHeight < tileMinWidth / 4
                    ? "1fr"
                    : getActivePagesCountInGroup(page) <= 4
                      ? "1fr 1fr"
                      : getActivePagesCountInGroup(page) <= 9
                        ? "1fr 1fr 1fr"
                        : getActivePagesCountInGroup(page) <= 12
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
                  style="
                    {
                      subpage.tileImageType === 'custom' && getTileImage(subpage.link)
                      ? `
                        background-image: url(${(getTileImage(subpage.link) || '')});
                        background-position: ${subpage.imagePositionX !== undefined ? subpage.imagePositionX : 50}% ${subpage.imagePositionY !== undefined ? subpage.imagePositionY : 50}%;
                        background-size: auto ${subpage.imageZoom || 125}% !important;
                        background-repeat: no-repeat;
                      `
                      : subpage.tileImageType === 'icon'
                        ? ''
                        : subpage.tileImageType !== 'none' // Keep !== none logic in order to have a fallback to the predefined image
                          ? useFrostedGlass || subpage.useCustomColors
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
                    {
                      subpage.useCustomColors ? `
                        background-color: ${subpage.backgroundColor}${useFrostedGlass ? toHexAlpha(frostedGlassOpacity) : ''} !important;
                      `
                      : ''
                    }
                    {showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
                    background-color: {subpage.backgroundColor};
                    color: {useFrostedGlass && !subpage.useCustomColors ? `rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b})` : subpage.textColor};
                    font-size: {
                      tileMinWidth / (
                        (subpage.tileImageType === 'icon' ? 1 : subpage.tileName.length) * 0.8 <= 1.8
                        ? 1.8
                        : (subpage.tileImageType === 'icon' ? 1 : subpage.tileName.length) * 0.8
                      ) / (
                        getActivePagesCountInGroup(page) <= 2
                        ? 1.5
                        : getActivePagesCountInGroup(page) <= 9
                          ? 2.5
                          : getActivePagesCountInGroup(page) <= 12
                            ? 3.2
                            : 4.2
                      )
                    }vh;
                    border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
                    border-radius: {groupTileBorderRadius}vh;
                    min-width: 10px;
                    {tileHeight <= tileMinWidth ? 'background-size: 180% auto;' : ''}
                    {!tileZoom ? "animation: none !important;" : ''}
                    {groupTileGrow ? `
                      flex-grow: 1;
                      flex-basis: ${
                        tileMinWidth < tileHeight
                        ? getActivePagesCountInGroup(page) <= 2
                          ? "100%"
                          : getActivePagesCountInGroup(page) <= 6
                            ? "40%"
                            : getActivePagesCountInGroup(page) <= 12
                              ? "28%"
                              : "21%"
                        : getActivePagesCountInGroup(page) === 2 && tileMinWidth - tileHeight < tileMinWidth / 4
                          ? "100%"
                          : getActivePagesCountInGroup(page) <= 4
                            ? "40%"
                            : getActivePagesCountInGroup(page) <= 9
                              ? "28%"
                              : getActivePagesCountInGroup(page) <= 12
                                ? "21%"
                                : "15%"
                      };
                    ` : ''}
                  "
                >
                  {#if (useFrostedGlass || subpage.useCustomColors) && (subpage.tileImageType === 'predefined' || (subpage.tileImageType === 'custom' && !getTileImage(subpage.link)))}
                    <div
                      class="frostedGlassIcon"
                      style={`
                        ${subpage.useCustomColors ? `
                          background-color: ${subpage.textColor};
                        ` : `
                          background-color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
                        `}
                        border-radius: ${tileBorderRadius}vh;
                        mask-image: url("static/images/thumbnails_frosted/${clearOldExtension(subpage.imageName)}.webp");
                        ${tileHeight <= tileMinWidth ? 'mask-size: 40% auto;' : 'mask-size: 65% auto;'}
                      `}
                    ></div>
                  {/if}
                  {subpage.tileImageType === 'none' ? subpage.tileName : ''}
                  {#if subpage.tileImageType === 'icon' }
                    <i
                      class={`fa-solid fa-${subpage.iconName}`}
                      style={`font-size: ${tileHeight <= tileMinWidth ? 70 : 110}%; line-height: 2px;`}
                    ></i>
                  {/if}
                </a>
              {/if}
            {/each}
          </div>

        {/if}
      {/if}
    {/each}

    {#if showPageQuickAdd}
      <button
        class="pageButton"
        style="
          {
            useFrostedGlass ? `
              backdrop-filter: blur(${frostedGlassStrength}px);
              -webkit-backdrop-filter: blur(${frostedGlassStrength}px);
              background-color: rgba(${frostedGlassColor.r}, ${frostedGlassColor.g}, ${frostedGlassColor.b}, ${frostedGlassOpacity}) !important;
            `
            : `
              background-color: rgb(0, 0, 0);
            `
          }
          {showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
          color: {useFrostedGlass ? `rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b})` : 'white'};
          font-size: {tileMinWidth / 2.4}vh;
          flex-grow: {tileGrow ? 1 : 0};
          min-width: {tileMinWidth}vh;
          height: {tileHeight}vh;
          border: {tileBorder}px solid rgb({tileBorderColor.r},{tileBorderColor.g},{tileBorderColor.b});
          border-radius: {tileBorderRadius}vh;
          cursor: pointer;
          padding: 0;
          {!tileZoom ? "animation: none !important" : ''}
        "
        on:click={openQuickAdd}
      >
        <i
          class="fa-solid fa-plus"
          style={`
            border-radius: ${tileBorderRadius}vh;
          `}
        />
      </button>
    {/if}
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
  .speedDialBox.hiddenSearchBar,
  .speedDialBox.compactNavbar {
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
    box-sizing: content-box;
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
