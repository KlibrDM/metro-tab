<script>
  export let node;
  export let level;
</script>

{#if node}
  <div class="bookmarkTreeNode" style={level > 0 ? "margin-left: 18px;": ""}>
    {#if node.type !== "separator"}
      <div class="bookmarkTreeNodeContent">
        {#if node.children}
          <i class="fas fa-folder" />
        {/if}
        <p>
          {node.url || node.title}
        </p>
      </div>
    {/if}

    {#if node.children}
      {#each node.children as child}
        <svelte:self node={child} level={level + 1} />
      {/each}
    {/if}
  </div>
{/if}

<style>
  p {
    margin-block-start: 0.2em;
    margin-block-end: 0.2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bookmarkTreeNode {
    position: relative;
  }
  .bookmarkTreeNode:has(div):before {
    content: "";
    position: absolute;
    left: 7px;
    top: 24px;
    bottom: 0;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  .bookmarkTreeNodeContent {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>