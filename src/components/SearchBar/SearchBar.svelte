<script>
  import Clock from "./Clock.svelte";
  import Note from "../Notes/Note.svelte";
  import { userData } from "../../store";
  import { searchEngineList } from "../../data/config";
  import { saveNotes } from "../../data/storage";

  export let remoteOpenNotes;

  let searchQuery = ""; //Binded to input
  let showSearchBar;
  let searchBarWidth;
  let searchBarHeight;
  let navbarCompact;
  let navbarOpacity;
  let navbarColor;
  let showElementsShadow;
  let useFrostedGlass;
  let frostedGlassStrength;
  let frostedGlassOpacity;
  let frostedGlassColor;
  let frostedGlassAccentColor;
  let searchEngine;
  let customSearchEngineUrl;
  let pinnedNote;

  let innerHeight = 0;

  userData.subscribe((data) => {
    showSearchBar = data.showSearchBar;
    searchBarWidth = data.searchBarWidth;
    searchBarHeight = data.searchBarHeight;
    searchEngine = data.searchEngine;
    customSearchEngineUrl = data.customSearchEngineUrl;
    navbarCompact = data.navbarCompact;
    navbarOpacity = data.navbarOpacity;
    navbarColor = data.navbarColor;
    showElementsShadow = data.showElementsShadow;
    useFrostedGlass = data.useFrostedGlass;
    frostedGlassStrength = data.frostedGlassStrength;
    frostedGlassOpacity = data.frostedGlassOpacity;
    frostedGlassColor = data.frostedGlassColor;
    frostedGlassAccentColor = data.frostedGlassAccentColor;
    pinnedNote = data.notes.find((note) => note.isPinned);
  });

  const saveNoteChanges = () => {
    userData.update((state) => {
      let modifiedNote = state.notes.find((note) => note.isPinned);
      modifiedNote.text = pinnedNote.text;
      modifiedNote.completed = pinnedNote.completed;
      state.notes = [...state.notes];

      saveNotes(state.notes);
      return state;
    });
  }

  const unpinNote = () => {
    userData.update((state) => {
      state.notes.find((note) => note.isPinned).isPinned = false;
      saveNotes(state.notes);
      return state;
    });
  }

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery !== "") {
      if (searchEngine === "custom"
        && customSearchEngineUrl
        && customSearchEngineUrl.length > 0
        && customSearchEngineUrl.indexOf("%s") !== -1
        && (customSearchEngineUrl.substring(0, 7) === "http://" || customSearchEngineUrl.substring(0, 8) === "https://")
      ) {
        const customSearchEngineUrlWithQuery = customSearchEngineUrl.replaceAll(
          "%s",
          encodeURIComponent(searchQuery)
        );
        window.location.assign(customSearchEngineUrlWithQuery);
      }
      else {
        const selectedSearchEngine = searchEngineList.find(
          (item) => item.name === searchEngine
        );

        if (selectedSearchEngine) {
          window.location.assign(
            selectedSearchEngine.link + escapeHTML(searchQuery)
          );
        }
        else {
          // Fall back to google if search engine not found
          window.location.assign(
            "https://www.google.com/search?q=" + escapeHTML(searchQuery)
          );
        }
      }
    }
  };

  let entityMap = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#x60;",
  };
  function escapeHTML(string) {
    return String(string).replace(/[<>"'`]/g, function (s) {
      return entityMap[s];
    });
  }
</script>

<svelte:window bind:innerHeight />

<div
  id="searchbarBox"
  class:hiddenSearchBar={!showSearchBar}
  class:compactNavbar={navbarCompact}
  style="background-color: rgba({navbarColor.r},{navbarColor.g},{navbarColor.b},{navbarOpacity})"
>
  {#if pinnedNote}
    <div id="note" style={`background-color: ${pinnedNote.backgroundColor}; color: ${pinnedNote.textColor};`}>
      <Note note={pinnedNote} saveAllNotes={saveNoteChanges} overrideMaxHeight={innerHeight > 840 && (showSearchBar && !navbarCompact) ? 104 : 52} />
      <div class="noteActions">
        <button style={`color: ${pinnedNote.textColor};`} on:click={remoteOpenNotes}>Open notes</button>
        <button style={`color: ${pinnedNote.textColor};`} on:click={unpinNote}>Unpin</button>
      </div>
    </div>
  {/if}
  <form
    id="searchbar"
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
      ${showElementsShadow ? 'box-shadow: 0px 0px 6px rgba(20, 20, 20, 0.4);' : ''}
      width: ${searchBarWidth}vw;
      height: ${searchBarHeight * 9 /* Magic number most closely matches old sizing */}px;
    `}
    on:submit={handleSearch}
  >
    <input
      id="searchInput"
      type="search"
      autocomplete="off"
      placeholder="Search"
      bind:value={searchQuery}
    />
    <button id="searchButton" aria-label="Search">
      <i class="fas fa-search" />
    </button>
  </form>
  <Clock />
</div>

<style>
  #searchbarBox {
    flex-basis: 25%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  #searchbarBox.hiddenSearchBar,
  #searchbarBox.compactNavbar {
    flex-basis: 140px;
  }
  #searchbar {
    min-width: 160px;
    border-radius: 100px;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.4);
    color: white;
    display: flex;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
  }
  #searchbarBox.hiddenSearchBar #searchbar {
    display: none;
  }
  #searchbarBox.compactNavbar #searchbar {
    position: absolute;
    bottom: 12px;
  }
  #searchbar:hover {
    background-color: rgba(0, 0, 0, 0.35);
  }
  #searchInput {
    background-color: rgba(0, 0, 0, 0);
    color: inherit;
    text-indent: calc(8px + 0.8vw);
    border: 0;
    min-height: 40px;
    min-width: 50px;
    flex-grow: 1;
    font-size: 20px;
  }
  #searchInput::placeholder {
    color: inherit;
  }
  #searchInput:-ms-input-placeholder {
    color: inherit;
  }
  #searchInput::-ms-input-placeholder {
    color: inherit;
  }
  #searchInput:focus {
    outline: none;
  }
  #searchInput:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
    border-radius: 100px;
  }
  #searchButton {
    padding-left: calc(8px + 0.8vw);
    padding-right: calc(8px + 0.8vw);
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    cursor: pointer;
    color: inherit;
    font-size: 18px;
  }
  #searchButton:focus {
    border-radius: 100px;
    outline: none !important;
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
  }
  #note {
    position: absolute;
    left: 2vw;
    width: clamp(200px, 17vw, 400px);
    border-radius: 5px;
  }
  #searchbarBox.hiddenSearchBar #note {
    bottom: 8px;
    width: clamp(200px, 24vw, 400px);
  }
  #searchbarBox.compactNavbar #note {
    bottom: 8px;
  }
  .noteActions {
    display: flex;
    gap: 6px;
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .noteActions > button {
    background-color: rgba(0, 0, 0, 0.2);
    border: 0;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .noteActions > button:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  @media screen and (max-width: 1199px) {
    #searchbarBox:not(.hiddenSearchBar) #note {
      display: none;
    }
  }
  @media screen and (max-width: 599px) {
    #note {
      display: none;
    }
  }
  @media screen and (max-height: 600px) {
    #note {
      bottom: 8px;
    }
  }
  @media screen and (max-height: 450px) {
    #note {
      display: none;
    }
  }
</style>
