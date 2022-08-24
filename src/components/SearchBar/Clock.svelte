<script>
  import { userData } from "../../store";

  let clockBackground;

  userData.subscribe((data) => {
    clockBackground = data.clockBackground;
  });

  let time = new Date();
  let hours = ("0" + time.getHours()).slice(-2);
  let minutes = ("0" + time.getMinutes()).slice(-2);

  //Update time every second
  setInterval(() => {
    time = new Date();
    hours = ("0" + time.getHours()).slice(-2);
    minutes = ("0" + time.getMinutes()).slice(-2);
  }, 1000);
</script>

<!--Use clockbg class only if clockBackground is true-->
<div id="time" class:clockbg={clockBackground}>
  {hours}:<span id="minutes">{minutes}</span>
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
