<script>
  import "./data/storage";
  import { userData } from "./store";
  import { STYLE_VARIABLES } from "./data/styleVariables";

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

  let tabName;
  let tabIcon;

  let remoteOpenNotes;

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    isBackgroundSolid = data.isBackgroundSolid;
    backgroundSolidColor = data.backgroundSolidColor;
    tabName = data.tabName;
    tabIcon = data.tabIcon;
  });

  // Update background image url when background image changes
  $: backgroundImageUrl = "static/images/bg/" + backgroundImage + "." + getBackgroundFormat(backgroundImage);

  // Set tab icon url based on selected icon (ONLY FOR FIREFOX - pop-in issue on Chrome)
  $: tabIconUrl = navigator.userAgent.indexOf("Firefox") !== -1 && tabIcon
    ? tabIcon.length > 5
      ? tabIcon
      : "static/images/icons/" + tabIcon + ".png"
    : undefined
</script>

<svelte:head>
	<title>{tabName}</title>
  {#if tabIconUrl}
    <link rel="icon" type="image/png" href={tabIconUrl} />
  {:else}
    <link rel="icon" type="image/png" href="img/favicon.png" />
  {/if}
</svelte:head>

<!--Use the url made above if user selects image provided by the extension (bgXXX)-->
<main
  style={`
    ${Object.entries(STYLE_VARIABLES).map(([key, value]) => `${key}: ${value};`).join(" ")}
    ${isBackgroundSolid
      ? "background-color: " + backgroundSolidColor + ";"
      : backgroundImage.length > 5
      ? "background-image: url(" + backgroundImage + ");"
      : "background-image: url(" + backgroundImageUrl + ");"}
  `}
>
  <Cover />
  <!-- Show QuickNav only if not Firefox -->
  {#if navigator.userAgent.indexOf("Firefox") === -1}
    <QuickNav />
  {/if}
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
