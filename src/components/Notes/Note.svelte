<script>
  export let note;
  export let saveAllNotes;
  export let overrideMaxHeight = undefined;
</script>

<div class="note">
  {#if note.type === "task"}
    <div class="checkbox">
      <input
        type="checkbox"
        bind:checked={note.completed}
        on:change={() => {
          saveAllNotes();
        }}
      />
    </div>
  {/if}
  <div class="noteWrapper">
    <!--Using a pre with hidden visibility for auto-resizing textarea-->
    <pre aria-hidden="true" style={overrideMaxHeight ? `max-height: ${overrideMaxHeight}px;` : ''}>{note.text + "\n"}</pre>
    <textarea
      placeholder="Type here..."
      bind:value={note.text}
      on:input={() => {
        saveAllNotes();
      }}
      class:strikethrough={note.completed}
      style={`color: ${note.textColor}; --placeholder-color: ${note.textColor}; ${overrideMaxHeight ? `max-height: ${overrideMaxHeight}px;` : ''}`}
    />
  </div>
</div>

<style>
  .strikethrough {
    text-decoration: line-through;
  }
  .note {
    display: flex;
    flex-grow: 1;
    padding: 5px 5px 8px 5px;
  }
  .checkbox {
    margin-top: 6px;
  }
  .noteWrapper {
    position: relative;
    min-height: 32px;
    width: 100%;
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
  textarea::placeholder {
    color: var(--placeholder-color);
  }
  pre,
  textarea {
    font-family: inherit;
    font-size: 1.2em;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 240px;
  }
</style>
