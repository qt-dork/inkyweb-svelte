<script lang="ts">
  import Sheaf from "$lib/components/Sheaf.svelte"
  import { onMount } from "svelte"

  // let story;
  // let loaded = false
  // function passToPlayer(event) {
  //   if (loaded) story = event.detail.data
  // }

  // const editor = new 

  // onMount(() => loaded = true)
  let doc = ""
  let ready = false

  onMount(async () => {
    ready = true
  })

</script>

<svelte:head>
  <title>Inky Web - Svelte</title>
</svelte:head>

<h1>CodeMirror deez nuts!</h1>
<h6>hah gottem</h6>
<div>
  <!-- {text} -->
</div>

<div class="app">
  {#if ready}<Sheaf {doc} />{/if}
</div>