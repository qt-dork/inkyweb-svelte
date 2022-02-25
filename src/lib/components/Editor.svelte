<script lang="ts">
  import { getContext, onMount } from "svelte"
  import type { SheafContext } from "$lib/context"

  const { editor, bindings, settings, small } = getContext<SheafContext>("sheaf")
  
  let editorElement: HTMLElement

  $: $editor.gutters = !small
  
  onMount(() => editor.mount(editorElement))

</script>

<div id="editor-container">
  <div id="editor" bind:this={editorElement}>
  </div>
</div>