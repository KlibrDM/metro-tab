<script>
  export let note;
  export let saveAllNotes;
  export let deleteNote;
  export let moveNote;
  export let index;

  let saveButtonState = 0; //local state to enable/disable save button

  const showSaveButton = () => {
    if (saveButtonState !== 1) {
      saveButtonState = 1;
    }
  };

  const saveNote = () => {
    //Disable save button
    saveButtonState = 0;
    //Save the notes
    saveAllNotes();
  };

  const strikeNote = () => {
    //Toggle strike
    note.completed = !note.completed;
    //Activate save button
    saveButtonState = 1;
  };
</script>

<div class="notes">
  <div class="positionButtonArea">
    <button
      on:click={() => {
        moveNote(index, "up");

        //Disable save button. Moving the item will save it
        saveButtonState = 0;
      }}
    >
      <i class="fa-solid fa-angle-up" />
    </button>

    <button
      on:click={() => {
        moveNote(index, "down");

        //Disable save button. Moving the item will save it
        saveButtonState = 0;
      }}
    >
      <i class="fa-solid fa-angle-down" />
    </button>
  </div>

  <div class="notesWrapper">
    <!--Using a pre with hidden visibility for auto-resizing textarea-->
    <pre aria-hidden="true">{note.text + "\n"}</pre>
    <textarea
      placeholder="Type here..."
      bind:value={note.text}
      on:input={() => {
        showSaveButton();
      }}
      class:strikethrough={note.completed}
    />
  </div>

  <div class="actionButtonArea">
    <button
      id="actionButtonSave"
      on:click={() => {
        saveNote();
      }}
      disabled={!saveButtonState}
    >
      <i class="fa-solid fa-check" />
    </button>

    <button
      id="actionButtonStrike"
      on:click={() => {
        strikeNote();
      }}
    >
      <i class="fa-solid fa-strikethrough" />
    </button>

    <button
      id="actionButtonDelete"
      on:click={() => {
        deleteNote(index);
      }}
    >
      <i class="fa-solid fa-trash-can" />
    </button>
  </div>
</div>

<style>
  .strikethrough {
    text-decoration: line-through;
  }
  .notes {
    display: flex;
    gap: 5px;
    padding: 5px 10px 10px 5px;
    border-radius: 5px;
    background-color: rgb(255, 255, 136);
  }
  .notesWrapper {
    flex-grow: 1;
    position: relative;
  }
  pre {
    margin: 0;
    color: red;
    overflow: hidden;
    visibility: hidden;
  }
  textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    resize: none;
    background-color: transparent;
  }
  pre,
  textarea {
    font-family: inherit;
    font-size: 1.2em;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 240px;
  }
  .actionButtonArea {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .actionButtonArea button {
    border: 0;
    cursor: pointer;
    background-color: transparent;
    font-size: 1.1em;
  }
  #actionButtonSave {
    color: rgb(21, 170, 21);
  }
  #actionButtonSave:disabled {
    color: lightgray;
  }
  #actionButtonStrike {
    color: orange;
  }
  #actionButtonDelete {
    color: red;
  }
  .positionButtonArea {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 5px;
  }
  .positionButtonArea button {
    border: 0;
    cursor: pointer;
    padding: 0px 2px;
    color: gray;
    background-color: transparent;
  }
</style>
