<script>
  import "./data/storage";
  import { userData } from "./store";

  import Cover from "./components/Cover.svelte";
  import QuickNav from "./components/QuickNav.svelte";
  import SearchBar from "./components/SearchBar/SearchBar.svelte";
  import SpeedDial from "./components/SpeedDial.svelte";
  import Settings from "./components/Settings/Settings.svelte";
  import Notes from "./components/Notes/Notes.svelte";

  let backgroundImage;
  let isBackgroundWhite = false;

  userData.subscribe((data) => {
    backgroundImage = data.backgroundImage;
    isBackgroundWhite = data.isBackgroundWhite;
  });

  //Update background image url when background image changes
  $: backgroundImageUrl = "static/images/bg/" + backgroundImage + ".jpg";
</script>

<!--Use the url made above if user selects image provided by the extension (bgXXX)-->
<main
  style={isBackgroundWhite
    ? "background-color: white;"
    : backgroundImage.length > 5
    ? "background-image: url(" + backgroundImage + ");"
    : "background-image: url(" + backgroundImageUrl + ");"}
>
  <Cover />
  <QuickNav />
  <SearchBar />
  <SpeedDial />
  <Settings />
  <Notes />
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
