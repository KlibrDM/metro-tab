<script>
  import { userData } from "../store";
  import { v4 as uuid } from "uuid";

  export let text = "";
  export let side = "top";
  export let showDelay = 300;
  export let hideDelay = 500;
  export let maxWidth = 400;

  let id = uuid();
  let mouseOverTooltip = false;
  let windowInnerWidth = 0;

  let darkMode = false;

  userData.subscribe((data) => {
    darkMode = data.darkMode;
  });

  $: if (mouseOverTooltip) {
    setTimeout(() => {
      if (!mouseOverTooltip) return;

      const tooltipContainer = document.getElementById(`tooltipChildrenContainer_${id}`);
      const containerRect = tooltipContainer.getBoundingClientRect();
      const tooltipBox = document.getElementById(`tooltipBox_${id}`);
      if(!containerRect || !tooltipBox) return;

      tooltipBox.style.display = 'block';

      if (side === "top") {
        tooltipBox.style.top = `${containerRect.top - tooltipBox.clientHeight - 4}px`;
      }
      else if (side === "bottom") {
        tooltipBox.style.top = `${containerRect.bottom + 4}px`;
      }

      if(containerRect.left - tooltipBox.clientWidth/2 < 0) {
        tooltipBox.style.left = `8px`;
      }
      else if(containerRect.right + tooltipBox.clientWidth/2 > window.innerWidth) {
        tooltipBox.style.right = `8px`;
      }
      else {
        tooltipBox.style.left = `${containerRect.left + (containerRect.width / 2) - (tooltipBox.clientWidth / 2)}px`;
      }

      // Show on next event loop to ensure display block is already applied
      setTimeout(() => {
        tooltipBox.style.opacity = '1';
      }, 0);
    }, showDelay);
  } else {
    setTimeout(() => {
      if (mouseOverTooltip) return;

      const tooltipBox = document.getElementById(`tooltipBox_${id}`);
      if(!tooltipBox) return;

      tooltipBox.style.opacity = '0';

      // Wait for the opacity transition to finish before hiding
      setTimeout(() => {
        tooltipBox.style.display = 'none';
      }, 200);
    }, hideDelay);
  }
</script>

<svelte:window bind:innerWidth={windowInnerWidth} />

<div
  class="tooltipChildrenContainer"
  id={`tooltipChildrenContainer_${id}`}
  on:mouseover={() => mouseOverTooltip = true}
  on:focus={() => mouseOverTooltip = true}
  on:mouseout={() => mouseOverTooltip = false}
  on:blur={() => mouseOverTooltip = false}
  tabindex="0"
>
  <slot />
</div>

<div
  class="tooltipBox"
  id={`tooltipBox_${id}`}
  class:darkModifier={darkMode}
  style="max-width: {maxWidth < windowInnerWidth ? maxWidth : windowInnerWidth - 16}px;"
  on:mouseover={() => mouseOverTooltip = true}
  on:focus={() => mouseOverTooltip = true}
  on:mouseout={() => mouseOverTooltip = false}
  on:blur={() => mouseOverTooltip = false}
>
  {text}
</div>

<style>
  .tooltipChildrenContainer {
    position: relative;
  }
  .tooltipBox {
    position: fixed;
    width: max-content;
    box-sizing: border-box;
    display: none;
    background-color: #ffffff;
    color: #000000;
    padding: 8px 12px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);
    z-index: 1000;
    font-size: 14px;
    text-align: center;
    transition: 0.2s;
    opacity: 0;
  }
  .tooltipBox.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
    border: 1px solid #3a99ff;
  }
</style>
