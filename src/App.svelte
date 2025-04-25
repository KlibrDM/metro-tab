<script>
  import "./data/storage";
  import { userData } from "./store";

  import Cover from "./components/Cover.svelte";
  import QuickNav from "./components/QuickNav.svelte";
  import SearchBar from "./components/SearchBar/SearchBar.svelte";
  import SpeedDial from "./components/SpeedDial/SpeedDial.svelte";
  import Settings from "./components/Settings/Settings.svelte";
  import Notes from "./components/Notes/Notes.svelte";
  import Entertainment from "./components/Entertainment.svelte";
  import Hint from "./components/Hint.svelte";
  import BackupReminder from "./components/BackupReminder.svelte";
  import { getBackgroundFormat } from "./data/tools";

  let backgroundImage;
  let isBackgroundSolid = false;
  let backgroundSolidColor;

  let remoteOpenNotes;

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    isBackgroundSolid = data.isBackgroundSolid;
    backgroundSolidColor = data.backgroundSolidColor;
  });

  //Update background image url when background image changes
  $: backgroundImageUrl = "static/images/bg/" + backgroundImage + "." + getBackgroundFormat(backgroundImage);
</script>

<!--Use the url made above if user selects image provided by the extension (bgXXX)-->
<main
  style={isBackgroundSolid
    ? "background-color: " + backgroundSolidColor + ";"
    : backgroundImage.length > 5
    ? "background-image: url(" + backgroundImage + ");"
    : "background-image: url(" + backgroundImageUrl + ");"}
>
  <Cover />
  <QuickNav />
  <SearchBar remoteOpenNotes={remoteOpenNotes} />
  <SpeedDial />
  <Settings />
  <Notes bind:remoteOpenNotes />
  <Entertainment />
  <Hint />
  <BackupReminder />
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }
</style>
