<script>
  import Clock from "./Clock.svelte";
  import RandomGithub from "./RandomGithub.svelte";
  import { userData } from "../../store";

  let searchQuery = ""; //Binded to input
  let navbarOpacity;
  let navbarColor;

  userData.subscribe((data) => {
    navbarOpacity = data.navbarOpacity;
    navbarColor = data.navbarColor;
  });

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery !== "") {
      window.location.assign(
        "https://www.google.com/search?q=" + escapeHTML(searchQuery)
      );
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

<div
  id="searchbarBox"
  style="background-color: rgba({navbarColor.r},{navbarColor.g},{navbarColor.b},{navbarOpacity})"
>
  <RandomGithub />
  <form id="searchbar" on:submit={handleSearch}>
    <input
      id="searchInput"
      type="search"
      autocomplete="off"
      placeholder="Search"
      bind:value={searchQuery}
    />
    <button id="searchButton">
      <i class="fas fa-search" style="color: white" />
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
  #searchbar {
    width: 50vw;
    border-radius: 100px;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.4);
    display: flex;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
  }
  #searchbar:hover {
    background-color: rgba(0, 0, 0, 0.35);
  }
  #searchInput {
    background-color: rgba(0, 0, 0, 0);
    color: white;
    text-indent: 15px;
    border: 0;
    min-height: 40px;
    height: 7vh;
    min-width: 50px;
    flex-grow: 1;
    font-size: 1.1em;
  }
  #searchInput::placeholder {
    color: white;
  }
  #searchInput:-ms-input-placeholder {
    color: white;
  }
  #searchInput::-ms-input-placeholder {
    color: white;
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
    padding-left: 20px;
    padding-right: 20px;
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    cursor: pointer;
    color: white;
  }
  #searchButton:focus {
    border-radius: 100px;
    outline: none !important;
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
  }

  @media screen and (max-width: 799px) {
    #searchbar {
      width: 75vw;
    }
  }
</style>
