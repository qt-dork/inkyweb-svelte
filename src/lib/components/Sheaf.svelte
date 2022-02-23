<script lang="ts">
import { SheafCore } from "$lib/core";
import type { SheafContext } from "$lib/context";
import { setContext } from "svelte";
import Editor from "./Editor.svelte";
import Player from "./Player.svelte";

  /** The value of the editor's contents. */
  export let doc = `LIST letters = a,b,c
    Once upon a time...
    -(opts)
    + Choice A.
    + Choice B.
    + Choice C.
  
    - They lived happily ever after {opts}.
      -> opts
  `
  
  // setup context, which is shared across all child components
  // this is so that we don't have to pass everything in as component attributes

  const editor = new SheafCore(doc)
  const ctx: SheafContext = {
    editor
  }

  setContext("sheaf", ctx)
</script>

<div class="sheaf-container">
  <div class="sheaf-panes">
    <div class="sheaf-pane sheaf-pane-editor">
      <Editor />
    </div>
    <div class="sheaf-pane sheaf-pane-preview">
      <Player />
    </div>
  </div>
</div>