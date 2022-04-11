<script>
  export let changeBackground;
  let bg, fileinput;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      bg = e.target.result;
      changeBackground(bg);
    };
  };
</script>

<div id="customBackgrounds">
  <h4>Custom Background</h4>
  <button
    class="chan"
    on:click={() => {
      fileinput.click();
    }}
  >
    Upload image
  </button>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
  />
</div>

<style>
  h4 {
    margin-block-start: 0.8em;
    margin-block-end: 0.2em;
  }
  button {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
  }
</style>
