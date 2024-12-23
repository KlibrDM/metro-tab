<script>
  import { userData } from "../../store";

  let clockBackground;
  let clock24Hour;

  userData.subscribe((data) => {
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
<div id="time" class:clockbg={clockBackground}>
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
    padding: 3px 5px;
    line-height: 1.2em;
  }
  #minutes {
    font-size: 0.7em;
    color: rgb(236, 236, 236);
  }
  #ampm {
    font-size: 0.4em;
    font-weight: 600;
    color: rgb(236, 236, 236);
    line-height: 1em;
  }
  .clockbg {
    background-color: rgba(0, 0, 0, 0.25);
  }

  @media screen and (max-width: 799px) {
    #time {
      display: none;
    }
  }

  @media screen and (max-height: 600px) {
    #time {
      font-size: 2.2em;
      line-height: 0.8em;
    }
  }
</style>
