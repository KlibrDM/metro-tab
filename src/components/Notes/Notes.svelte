<script>
  import { userData } from "../../store";
  import { saveNotes } from "../../data/storage";
  import { notesColors } from "../../data/config";
  import Note from "./Note.svelte";

  let isPanelShown = false;
  let isPanelShownRemote = false;
  let userNotes = []; //local data for notes (excluding important)
  let importantNotes = [] //local data for important notes
  let darkMode = false;
  let showSaveIcon = false;
  let showSaveIconTimeout;

  export const remoteOpenNotes = () => {
    isPanelShown = true;
    isPanelShownRemote = true;
  }

  //Subscribe to notes
  userData.subscribe((data) => {
    userNotes = data.notes.filter((note) => !note.important);
    importantNotes = data.notes.filter((note) => note.important);
    darkMode = data.darkMode;
  });

  const toggleNotesPanel = () => {
    isPanelShown = !isPanelShown;
  };

  let allowDrag = false; // Allow drag and drop only when the mouse is over the drag handle
  let draggedItem = undefined;
  let draggedItemIndex = undefined;
  let draggedOverIndex = undefined;
  let draggedList = undefined;

  const handleDragEnd = (index, list) => {
    // If the dragged item is dropped on itself, return early
    if (index === draggedOverIndex) {
      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
      draggedList = undefined;
      return;
    }

    if (draggedItemIndex !== undefined) {
      // Remove the dragged item from the list
      list.splice(draggedItemIndex, 1);

      // Insert the dragged item at the new position
      list.splice(draggedOverIndex, 0, draggedItem);

      list = [...list];

      draggedItem = undefined;
      draggedItemIndex = undefined;
      draggedOverIndex = undefined;
      draggedList = undefined;

      //Save changes
      saveAllNotes();
    }
  };

  //Create new empty note at the beginning of array
  const createNewNote = (type) => {
    userNotes.unshift({
      text: "",
      textColor: type === "note" ? notesColors[0].text : notesColors[1].text,
      backgroundColor: type === "note" ? notesColors[0].background : notesColors[1].background,
      type,
      important: false,
      completed: false,
      isPinned: false,
    });

    saveAllNotes();
  };

  const saveAllNotes = () => {
    showSaveIcon = true;
    clearTimeout(showSaveIconTimeout);
    showSaveIconTimeout = setTimeout(() => {
      showSaveIcon = false;
    }, 720);

    // Update state
    userData.update((state) => {
      state.notes = [...importantNotes, ...userNotes];
      return state;
    });

    // Save to local storage
    saveNotes([...importantNotes, ...userNotes]);
  };

  const deleteNote = (index, list) => {
    list.splice(index, 1);

    saveAllNotes();
  };

  const toggleImportant = (index, list) => {
    const moveToImportant = !list[index].important; // Boolean to check which list is first in remake
    list[index].important = !list[index].important;

    // Remake lists
    const oldUserNotes = [...userNotes];
    const oldImportantNotes = [...importantNotes];

    if (moveToImportant) {
      // If note is moved to important, remake lists with userNotes first, then importantNotes
      userNotes = [...oldUserNotes, ...oldImportantNotes].filter((note) => !note.important);
      importantNotes = [...oldUserNotes, ...oldImportantNotes].filter((note) => note.important);
    }
    else {
      userNotes = [...oldImportantNotes, ...oldUserNotes].filter((note) => !note.important);
      importantNotes = [...oldImportantNotes, ...oldUserNotes].filter((note) => note.important);
    }

    saveAllNotes();
  }

  const toggleCompleted = (index, list) => {
    list[index].completed = !list[index].completed;

    saveAllNotes();
  }

  const changeColor = (index, list, color) => {
    list[index].backgroundColor = color.background;
    list[index].textColor = color.text;

    saveAllNotes();
  }

  const togglePin = (index, list) => {
    const isPinning = !list[index].isPinned;

    // Remove pin from all notes
    userNotes.forEach((note) => note.isPinned = false);
    importantNotes.forEach((note) => note.isPinned = false);

    // Pin the selected note
    if (isPinning) {
      list[index].isPinned = true;
    }

    saveAllNotes();
  }

  // Transition
  function notesEntrance() {
    let aux = isPanelShownRemote;
    isPanelShownRemote = false;

    return {
      duration: 500,
      css: (t, u) => `clip-path: circle(${t * 130}% at ${aux ? '80px' : 'calc(100% - 80px)'} 3.5vh)`,
    };
  }

  function notesExit() {
    return {
      duration: 500,
      css: (t, u) => `clip-path: circle(${t * 130}% at calc(100% - 80px) 3.5vh)`,
    };
  }
</script>

<button
  on:click={toggleNotesPanel}
  id="notesButton"
  aria-label="Notes"
  class:highZIndex={isPanelShown}
  class:darkModifier={darkMode}
>
  <i class="fa-solid fa-note-sticky" />
</button>

{#if isPanelShown}
  <div id="notesPanel" class:darkModifier={darkMode} in:notesEntrance out:notesExit>
    <div id="notesTop">
      <h2>Notes</h2>
      <div id="notesNewButtons">
        <button class="newButton" id="newNoteButton" on:click={() => createNewNote("note")}>New note</button>
        <button class="newButton" id="newTaskButton" on:click={() => createNewNote("task")}>New task</button>
        {#if showSaveIcon}
          <div class="saveIcon">
            <i class="fa-solid fa-floppy-disk" />
          </div>
        {/if}
      </div>
    </div>

    <div id="notesContainer">
      <div id="notesSection">
        <h3 class="sectionTitle">
          General
        </h3>
    
        <div class="notesList" class:notDragged={draggedList !== undefined && draggedList !== "userNotes"}>
          {#if !userNotes.length}
            <p>You don't have any notes yet</p>
          {/if}
          {#each userNotes as note, index}
            <div
              class="noteContainer"
              draggable={allowDrag}
              on:dragstart={() => { draggedItem = note; draggedItemIndex = index; draggedList = "userNotes" }}
              on:dragend={() => handleDragEnd(index, userNotes)}
              on:dragover={(e) => { e.preventDefault(); draggedOverIndex = index; }}
              on:dragenter={(e) => { e.preventDefault(); }}
            >
              <div
                class="note"
                style="
                  background-color: {note.backgroundColor};
                  color: {note.textColor};
                  background: {
                    index === draggedItemIndex && draggedList === "userNotes" ? `linear-gradient(to right, red, ${note.backgroundColor} 50px)` :
                    index === draggedOverIndex && draggedList === "userNotes" ?
                      draggedItemIndex !== undefined && draggedItemIndex > index ?
                      `linear-gradient(135deg, #3a99ff, ${note.backgroundColor} 40px)` :
                      `linear-gradient(45deg, #3a99ff, ${note.backgroundColor} 40px)` :
                    note.backgroundColor
                  };
                "
              >
                <div class="dragHandle"
                  on:focus={() => { allowDrag = true; }}
                  on:mouseover={() => { allowDrag = true; }}
                  on:mouseleave={() => { allowDrag = false; }}
                >
                  <i class="fa-solid fa-grip-vertical" />
                </div>

                <div class="noteContent">
                  <Note {note} {saveAllNotes} />

                  <div class="noteActions">
                    <button on:click={() => deleteNote(index, userNotes)}>
                      <i class="fa-solid fa-trash" style={`color: ${note.textColor}`} />
                    </button>
                    <button on:click={() => togglePin(index, userNotes)}>
                      <i class="fa-solid fa-thumbtack" style={`color: ${note.isPinned ? "#3a54ff" : note.textColor}`} />
                    </button>
                    <button on:click={() => toggleImportant(index, userNotes)}>
                      <i class="fa-solid fa-star" style={`color: ${note.textColor}`} />
                    </button>
                    <button on:click={() => toggleCompleted(index, userNotes)}>
                      <i class="fa-solid fa-check" style={`color: ${note.completed ? "#41ff1e" : note.textColor}`} />
                    </button>
                    <div class="noteColors">
                      {#each notesColors as color}
                        <button
                          style="background-color: {color.background};"
                          on:click={() => changeColor(index, userNotes, color)}
                        />
                      {/each}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          {/each}
        </div>
      </div>

      <div id="importantSection">
        <h3 class="sectionTitle">
          Important
          <i class="fa-solid fa-star" style="color: #f0d732" />
        </h3>
    
        <div class="notesList" class:notDragged={draggedList !== undefined && draggedList !== "importantNotes"}>
          {#if !importantNotes.length}
            <p>No notes are marked as important</p>
          {/if}
          {#each importantNotes as note, index}
            <div
              class="noteContainer"
              draggable={allowDrag}
              on:dragstart={() => { draggedItem = note; draggedItemIndex = index; draggedList = "importantNotes" }}
              on:dragend={() => handleDragEnd(index, importantNotes)}
              on:dragover={(e) => { e.preventDefault(); draggedOverIndex = index; }}
              on:dragenter={(e) => { e.preventDefault(); }}
            >
              <div
                class="note"
                style="
                  background-color: {note.backgroundColor};
                  color: {note.textColor};
                  background: {
                    index === draggedItemIndex && draggedList === "importantNotes" ? `linear-gradient(to right, red, ${note.backgroundColor} 50px)` :
                    index === draggedOverIndex && draggedList === "importantNotes" ?
                      draggedItemIndex !== undefined && draggedItemIndex > index ?
                      `linear-gradient(135deg, #3a99ff, ${note.backgroundColor} 40px)` :
                      `linear-gradient(45deg, #3a99ff, ${note.backgroundColor} 40px)` :
                    note.backgroundColor
                  };
                "
              >
                <div class="dragHandle"
                  on:focus={() => { allowDrag = true; }}
                  on:mouseover={() => { allowDrag = true; }}
                  on:mouseleave={() => { allowDrag = false; }}
                >
                  <i class="fa-solid fa-grip-vertical" />
                </div>

                <div class="noteContent">
                  <Note {note} {saveAllNotes} />

                  <div class="noteActions">
                    <button on:click={() => deleteNote(index, importantNotes)}>
                      <i class="fa-solid fa-trash" style={`color: ${note.textColor}`} />
                    </button>
                    <button on:click={() => togglePin(index, importantNotes)}>
                      <i class="fa-solid fa-thumbtack" style={`color: ${note.isPinned ? "#3a54ff" : note.textColor}`} />
                    </button>
                    <button on:click={() => toggleImportant(index, importantNotes)}>
                      <i class="fa-solid fa-star" style="color: #ffe11e" />
                    </button>
                    <button on:click={() => toggleCompleted(index, importantNotes)}>
                      <i class="fa-solid fa-check" style={`color: ${note.completed ? "#41ff1e" : note.textColor}`} />
                    </button>
                    <div class="noteColors">
                      {#each notesColors as color}
                        <button
                          style="background-color: {color.background};"
                          on:click={() => changeColor(index, importantNotes, color)}
                        />
                      {/each}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  #notesButton {
    position: absolute;
    top: 20px;
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
  #notesButton.darkModifier.highZIndex {
    background-color: rgba(255, 255, 255, 0.75);
    color: black;
  }
  #notesButton.darkModifier.highZIndex:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
  #notesPanel {
    padding: 20px 40px;
    position: absolute;
    background-color: white;
    right: 0;
    top: 0;
    z-index: 50;
    max-height: 100vh;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
  }
  #notesPanel.darkModifier {
    background-color: rgb(3, 7, 15);
    color: white;
  }
  #notesTop {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  #notesNewButtons {
    margin-top: 4px;
    display: flex;
    gap: 8px;
  }
  #notesContainer {
    display: flex;
    gap: 20px;
  }
  #notesSection {
    flex-grow: 1;
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
  }
  #importantSection {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 50%;
  }
  .sectionTitle {
    margin: 8px 0px;
  }
  .newButton {
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    transition: 0.3s;
  }
  #newNoteButton {
    background-color: #0b1;
  }
  #newNoteButton:hover {
    background-color: #0c2;
  }
  #newTaskButton {
    background-color: #3a99ff;
  }
  #newTaskButton:hover {
    background-color: #2f84e0;
  }
  .saveIcon {
    font-size: 1.2em;
    margin-left: 8px;
    animation: blink 0.5s infinite both;
  }
  .notesList {
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: 0.3s;
  }
  .notesList.notDragged {
    opacity: 0.5;
  }
  .note {
    display: flex;
    border-radius: 5px;
    align-items: center;
  }
  .dragHandle {
    padding: 5px 5px 5px 10px;
  }
  .noteContent {
    width: 100%;
  }
  .noteActions {
    display: flex;
    gap: 10px;
    margin: 0px 5px 5px 5px;
  }
  .noteActions > button {
    width: 25px;
    height: 25px;
    padding: 5px;
    border: 0;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .noteActions > button:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  .noteColors {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    flex-wrap: wrap;
    transition: 0.3s;
  }
  .noteColors:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  .noteColors > button {
    width: 12px;
    height: 12px;
    border: 0;
    border-radius: 100%;
    cursor: pointer;
    transition: 0.3s;
  }
  .noteColors > button:hover {
    transform: scale(1.2);
  }
  .highZIndex {
    z-index: 60 !important;
  }
  @media screen and (max-width: 799px) {
    #notesContainer {
      flex-direction: column-reverse;
    }
  }
  @media screen and (max-width: 450px) {
    #notesPanel {
      width: 100vw;
      padding: 20px;
    }
    #notesTop {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
  }
</style>
