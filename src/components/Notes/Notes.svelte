<script>
  import { userData } from "../../store";
  import { saveNotes } from "../../data/storage";
  import Note from "./Note.svelte";

  let isPanelShown = false;
  let userNotes = []; //local data for notes

  //Subscribe to notes
  userData.subscribe((data) => {
    userNotes = data.notes;
  });

  const toggleNotesPanel = () => {
    isPanelShown = !isPanelShown;
  };

  //Create new empty note at the beginning of array
  const createNewNote = () => {
    userNotes.unshift({
      text: "",
      completed: false,
    });

    userData.update((state) => {
      state.notes = userNotes;
      return state;
    });

    saveNotes(userNotes);
  };

  const saveAllNotes = () => {
    //Update state
    userData.update((state) => {
      state.notes = userNotes;
      return state;
    });

    //Save to local storage
    saveNotes(userNotes);
  };

  const deleteNote = (index) => {
    //Delete 1 note from the specified index
    userNotes.splice(index, 1);

    //Save changes
    saveAllNotes();
  };

  const moveNote = (index, direction) => {
    //Return if the move is not possible
    if (direction === "up" && index == 0) {
      return;
    }
    if (direction === "down" && index == userNotes.length - 1) {
      return;
    }

    //Get current item
    let item = userNotes[index];

    //Remove current item from old location
    userNotes.splice(index, 1);

    //Add current item in the direction
    if (direction === "up") {
      userNotes.splice(index - 1, 0, item);
    } else if (direction === "down") {
      userNotes.splice(index + 1, 0, item);
    }

    //Save changes
    saveAllNotes();
  };

  //Transition
  function notesEntrance() {
    return {
      duration: 400,
      css: (t, u) => `clip-path: circle(${t * 130}% at 82% 3.5vh)`,
    };
  }
</script>

<button
  on:click={toggleNotesPanel}
  id="notesButton"
  class:highZIndex={isPanelShown}
>
  <i class="fa-solid fa-note-sticky" />
</button>

{#if isPanelShown}
  <div id="notesPanel" transition:notesEntrance>
    <div id="notesTop">
      <h2>Notes</h2>
      <button on:click={createNewNote}>New</button>
    </div>

    <div id="notesBox">
      {#if userNotes.length === 0}
        <p>You don't have any notes yet</p>
      {/if}
      {#each userNotes as note, index}
        <Note {note} {saveAllNotes} {deleteNote} {moveNote} {index} />
      {/each}
    </div>
  </div>
{/if}

<style>
  #notesButton {
    position: absolute;
    top: 2vh;
    right: 65px;
    width: 30px;
    height: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    transition: 0.3s;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
    z-index: 16;
  }
  #notesButton:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  #notesPanel {
    padding: 20px 40px;
    position: absolute;
    background-color: white;
    right: 0;
    top: 0;
    z-index: 50;
    max-height: 100vh;
    width: 450px;
    overflow-y: auto;
    box-sizing: border-box;
  }
  #notesTop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #notesTop > * {
    display: inline-block;
  }
  #notesTop > button {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #0b1;
    transition: 0.3s;
  }
  #notesTop > button:hover {
    background-color: #0c2;
  }
  #notesBox {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .highZIndex {
    z-index: 60 !important;
  }
  @media screen and (max-width: 450px) {
    #notesPanel {
      width: 100vw;
      padding: 20px;
    }
  }
</style>
