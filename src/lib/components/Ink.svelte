<script lang="ts">
  import type { Story } from 'inkjs/engine/Story'
import { onMount } from 'svelte';

  export let story: Story | null;
  let rendering = false

  interface Choice{text: string; index: number;}
  const Choice = (text: string, index: number): Choice => ({text, index})
  interface StoryState {
    texts: Text[]
    choices: Choice[]
  }
  type Text = {text: string;}
  const Text = (text: string): Text => ({text})

  const initialStoryState: StoryState = {texts: [], choices: []}
  let storyState = initialStoryState

  $: console.log(story)

  $: if (story) {
    storyState = initialStoryState
    console.log("here")

    continueStory(story)
  }

  $: ({texts, choices} = storyState)

  const continueStory = (story: Story) => {
    while (story.canContinue) {
      var text = story.Continue() as string
      var tags = story.currentTags
      storyState.texts = [...storyState.texts, Text(text)]
      if (tags && tags.length > 0) {
        storyState.texts = [...storyState.texts, Text(tags.map(t => `#${t}`).join(" "))]
      }
    }
    story.currentChoices.forEach((choice, index) => {
      storyState.choices = [...storyState.choices, Choice(choice.text, choice.index)]
    })
  }

  const choiceOnChoose = (index: number) => {
    storyState.choices = []
    story.ChooseChoiceIndex(index)
    continueStory(story)
  }

  onMount(() => {
    rendering = false
  })
</script>

<div class="ink-container">
  {#if rendering}
    <div class="loading">
      <span>Loading...</span>
    </div>
  {/if}
  {#each texts as t}
    <p>{t.text}
  {/each}
  {#if choices.length > 0}
    {#each choices as c (c.index)}
      <button type="button" on:click|preventDefault={() => choiceOnChoose(c.index)}>{c.text}</button>
    {/each}
  {/if}
</div>