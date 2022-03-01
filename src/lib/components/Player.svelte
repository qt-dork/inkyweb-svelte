<script lang="ts">
  import { getContext, onMount } from "svelte"
  import type { SheafContext } from "$lib/context"

  import { Compiler, CompilerOptions } from "inkjs/compiler/Compiler"
  import { Story as ParsedStory } from "inkjs/compiler/Parser/ParsedHierarchy/Story"

  import Ink from "./Ink.svelte";

  const { editor } = getContext<SheafContext>("sheaf")

  // let render = new RenderHandler()
  // let compiled = 
  let story
  let loaded = false
  // let parsedStory

  const compileOnChange = (ink: string) => {
    let inkStory
    // console.log(ink)
    const options = new CompilerOptions(null, [], false, null, null)
    const compiler = new Compiler(ink, options)
    
    
    try {
      inkStory = compiler.Compile()
      // parsedStory = compiler.parsedStory
      // console.log(inkStory)
    } catch (e) {
      // parsedStory = undefined
      console.error(e)
    }
    return inkStory
  }

  onMount(() => {
    loaded = true
  })
  
  $: if ($editor.doc && loaded) {
    story = compileOnChange($editor.doc.sliceString(0))
  }
</script>

<div class="sheaf-preview-container">
  <div class="sheaf-preview">
    <Ink story={story} />
    <!-- <Wikitext wikitext={() => story} /> -->
  </div>
</div>