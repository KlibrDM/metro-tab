<script>
  import { userData } from "../../store";

  let showSearchBar;
  let showElementsShadow;
  let useFrostedGlass;
  let frostedGlassStrength;
  let frostedGlassOpacity;
  let frostedGlassColor;
  let frostedGlassAccentColor;
  let clockBackground;
  let clock24Hour;

  userData.subscribe((data) => {
    showSearchBar = data.showSearchBar;
    showElementsShadow = data.showElementsShadow;
    useFrostedGlass = data.useFrostedGlass;
    frostedGlassStrength = data.frostedGlassStrength;
    frostedGlassOpacity = data.frostedGlassOpacity;
    frostedGlassColor = data.frostedGlassColor;
    frostedGlassAccentColor = data.frostedGlassAccentColor;
    clockBackground = data.clockBackground;
    clock24Hour = data.clock24Hour;
  });

  let time = new Date();
  let auxHours = time.getHours();
  if (!clock24Hour) {
    auxHours = auxHours % 12;
    if (auxHours === 0) auxHours = 12;
  }
  let hours = ("0" + auxHours).slice(-2);
  let minutes = ("0" + time.getMinutes()).slice(-2);
  let ampm = time.getHours() >= 12 ? "PM" : "AM";

  //Update time every second
  setInterval(() => {
    time = new Date();
    auxHours = time.getHours();
    if (!clock24Hour) {
      auxHours = auxHours % 12;
      if (auxHours === 0) auxHours = 12;
    }
    hours = ("0" + auxHours).slice(-2);
    minutes = ("0" + time.getMinutes()).slice(-2);
    ampm = time.getHours() >= 12 ? "PM" : "AM";
  }, 1000);
</script>

<!--Use clockbg class only if clockBackground is true-->
<div
  id="time"
  class:hiddenSearchBar={!showSearchBar}
  class:clockbg={clockBackground}
  style={`
    ${
      useFrostedGlass && clockBackground
        ? `
          color: rgb(${frostedGlassAccentColor.r}, ${frostedGlassAccentColor.g}, ${frostedGlassAccentColor.b});
          backdrop-filter: blur(${frostedGlassStrength}px);
          -webkit-backdrop-filter: blur(${frostedGlassStrength}px);
          background-color: rgba(${frostedGlassColor.r}, ${frostedGlassColor.g}, ${frostedGlassColor.b}, ${frostedGlassOpacity}) !important;
        `
        : ''
    }
    ${clockBackground && showElementsShadow ? 'box-shadow: 0px 0px 10px rgba(20, 20, 20, 0.2);' : ''}
  `}
>
  {hours}:<span id="minutes">{minutes}</span>
  {#if !clock24Hour}
    <span id="ampm">{ampm}</span>
  {/if}
</div>

<style>
  #time {
    position: absolute;
    font-size: 3em;
    right: 2vw;
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
    line-height: 1.2em;
  }
  #time.hiddenSearchBar {
    bottom: 12px;
  }
  #minutes {
    font-size: 0.7em;
  }
  #ampm {
    font-size: 0.4em;
    font-weight: 600;
    line-height: 1em;
  }
  .clockbg {
    background-color: rgba(0, 0, 0, 0.25);
  }

  @media screen and (max-width: 799px) {
    #time:not(.hiddenSearchBar) {
      display: none;
    }
  }

  @media screen and (max-height: 600px) {
    #time {
      font-size: 2.2em;
      line-height: 0.8em;
      bottom: 3vh;
      padding: 2px 4px;
    }
  }
</style>
