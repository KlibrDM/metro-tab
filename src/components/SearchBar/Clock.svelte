<script>
  import moment from "moment";
  import { userData } from "../../store";
  import { ClockDateFormatOptions, ClockPositionOptions } from "../../data/options";

  let showSearchBar;
  let navbarCompact;
  let showElementsShadow;
  let useFrostedGlass;
  let frostedGlassStrength;
  let frostedGlassOpacity;
  let frostedGlassColor;
  let frostedGlassAccentColor;
  let clockBackground;
  let clock24Hour;
  let clockDateFormat;
  let clockPosition;
  let clockSize;
  let searchBarHeight;

  userData.subscribe((data) => {
    showSearchBar = data.showSearchBar;
    navbarCompact = data.navbarCompact;
    showElementsShadow = data.showElementsShadow;
    useFrostedGlass = data.useFrostedGlass;
    frostedGlassStrength = data.frostedGlassStrength;
    frostedGlassOpacity = data.frostedGlassOpacity;
    frostedGlassColor = data.frostedGlassColor;
    frostedGlassAccentColor = data.frostedGlassAccentColor;
    clockBackground = data.clockBackground;
    clock24Hour = data.clock24Hour;
    clockDateFormat = data.clockDateFormat;
    clockPosition = data.clockPosition;
    clockSize = data.clockSize;
    searchBarHeight = data.searchBarHeight;
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
  let date = clockDateFormat !== ClockDateFormatOptions.None
    ? moment().format(clockDateFormat)
    : "";
  let dateSizeMultiplier = getDateFormatFontSizeMultiplier();

  //Update time every second
  setInterval(() => {
    time = new Date();
    auxHours = time.getHours();

    // Check if day has changed (to also update date at the same time)
    let hasDayChanged = (hours === "23" || hours === "11") && auxHours === 0;

    if (!clock24Hour) {
      auxHours = auxHours % 12;
      if (auxHours === 0) auxHours = 12;
    }
    hours = ("0" + auxHours).slice(-2);
    minutes = ("0" + time.getMinutes()).slice(-2);
    ampm = time.getHours() >= 12 ? "PM" : "AM";
    
    if (clockDateFormat !== ClockDateFormatOptions.None && hasDayChanged) {
      date = moment().format(clockDateFormat);
    }
  }, 1000);

  function getDateFormatFontSizeMultiplier() {
    if (clockPosition === ClockPositionOptions.Center && !(showSearchBar && navbarCompact)) {
      return 4;
    }

    switch (clockDateFormat) {
      case ClockDateFormatOptions.DayMonth:
      case ClockDateFormatOptions.DayShortMonth:
      case ClockDateFormatOptions.MonthDay:
      case ClockDateFormatOptions.ShortMonthDay:
        return navbarCompact ? 3.6 : 4.8;
      case ClockDateFormatOptions.DayMonthYear:
      case ClockDateFormatOptions.MonthDayYear:
      case ClockDateFormatOptions.YearMonthDay:
      case ClockDateFormatOptions.ShortDayDayMonth:
      case ClockDateFormatOptions.ShortDayMonthDay:
      case ClockDateFormatOptions.ShortDayDayShortMonth:
      case ClockDateFormatOptions.ShortDayShortMonthDay:
        return 3.6;
      case ClockDateFormatOptions.ShortDayDayMonthYear:
      case ClockDateFormatOptions.ShortDayMonthDayYear:
      case ClockDateFormatOptions.LongDayDayMonth:
      case ClockDateFormatOptions.LongDayMonthDay:
        return 3;
      case ClockDateFormatOptions.LongDayDayMonthYear:
      case ClockDateFormatOptions.LongDayMonthDayYear:
        return 2.6;
      default:
        return 2.6;
    }
  };

  // Update date immediately if clockDateFormat changes
  $: if(clockDateFormat !== ClockDateFormatOptions.None) {
    date = moment().format(clockDateFormat);
    dateSizeMultiplier = getDateFormatFontSizeMultiplier();
  } else {
    date = undefined;
    dateSizeMultiplier = 2.6;
  }

  $: centerAlignConditionsMet = clockPosition === ClockPositionOptions.Center && !(showSearchBar && navbarCompact);
  $: realClockSize =
    navbarCompact
      ? !showSearchBar && clockPosition === ClockPositionOptions.Center
        ? clockSize
        : Math.min(clockSize, 6)
      : clockSize;
</script>

<div
  id="clock"
  class:hiddenSearchBar={!showSearchBar}
  class:compactNavbar={navbarCompact}
  class:clockbg={clockBackground}
  class:leftAligned={clockPosition === ClockPositionOptions.Left}
  class:centerAligned={centerAlignConditionsMet}
  class:centerAlignedRow={centerAlignConditionsMet && (navbarCompact || showSearchBar)}
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
    ${centerAlignConditionsMet ? `bottom: ${showSearchBar ? searchBarHeight * 8 + 32 : 12}px;` : ''}
  `}
>
  <div id="time">
    <p id="hours" style={`font-size: ${realClockSize * 8}px`}>{hours}:</p><p id="minutes" style={`font-size: ${realClockSize * 5.6}px`}>{minutes}</p>
    {#if !clock24Hour}
      <p id="ampm" style={`font-size: ${realClockSize * 3.2}px`}>&nbsp;{ampm}</p>
    {/if}
  </div>
  {#if date}
    <p id="date" style={`font-size: ${realClockSize * dateSizeMultiplier}px`}>{date}</p>
  {/if}
</div>

<style>
  p {
    margin: 0;
  }
  #clock {
    position: absolute;
    right: 2vw;
    color: white;
    border-radius: 12px;
    padding: 2px 10px 8px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #clock.compactNavbar {
    bottom: 12px;
  }
  #clock.leftAligned {
    left: 2vw;
    right: unset;
  }
  #clock.centerAligned {
    left: unset;
    right: unset;
    position: static;
    margin-top: 8px;
  }
  #clock.centerAlignedRow {
    flex-direction: row;
    align-items: baseline;
    gap: 16px;
  }
  #time {
    display: flex;
    align-items: baseline;
  }
  #hours,
  #minutes {
    line-height: 1.2em;
  }
  #ampm {
    font-weight: 600;
    line-height: 1.2em;
    margin-left: 4px;
  }
  .clockbg {
    background-color: rgba(0, 0, 0, 0.25);
  }
  @media screen and (max-width: 920px) {
    #clock:not(.hiddenSearchBar) {
      display: none;
    }
  }
  @media screen and (max-height: 640px) {
    #clock:not(.centerAligned) #date {
      display: none;
    }
  }
</style>
