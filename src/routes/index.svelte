<!-- <script context="module">
  export const prerender = true;
</script> -->

<script lang="ts">
  import Sheaf from "$lib/components/Sheaf.svelte"
  import { onMount } from "svelte"

  let doc = `LIST letters = a,b,c
    Once upon a time...
    -(opts)
    + Choice A.
    + Choice B.
    + Choice C.
  
    - They lived happily ever after {opts}.
      -> opts
  `
  let ready = false

  onMount(() => {
    ready = true
  })

</script>

<svelte:head>
  <title>Inky Web - Svelte</title>
</svelte:head>

<h1>Inkyweb Svelte</h1>
<div>
  <!-- {text} -->
</div>

<div class="app">
  {#if ready}<Sheaf {doc} />{/if}
</div>