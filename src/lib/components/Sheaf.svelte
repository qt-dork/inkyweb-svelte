<!--
  @component Editor based off of Wikijump's Sheaf editor.
-->

<script lang="ts">
  import { setContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { PreferenceHandler } from "$lib/pref";
  import { matchBreakpoint } from "$lib/media.rem";

  import { getDefaultSheafSettings, type SheafContext } from "$lib/context";
  import { SheafCore } from "$lib/core";
  import type { SheafBindings } from "$lib/extensions/bindings";

  import Editor from "./Editor.svelte";
  import Player from "./Player.svelte";

  /** Height of the editor's container */
  export let height = "100%"
  /** Width of the editor's container. */
  export let width = "100%"
  /** The value of the editor's contents. */
  export let doc = ""
  /** Callbacks to call depending on editor events. */
  export let bindings: SheafBindings = {}
  
  // setup context, which is shared across all child components
  // this is so that we don't have to pass everything in as component attributes

  const editor = new SheafCore(doc, bindings)

  const settings = new PreferenceHandler("_sheaf-ink_").bind(
    "settings",
    getDefaultSheafSettings()
  )

  const small: Readable<boolean> = {
    subscribe: sub => matchBreakpoint.subscribe(fn => sub(fn("<normal")))
  }

  const ctx: SheafContext = {
    editor,
    bindings,
    settings,
    small
  }

  setContext("sheaf", ctx)

  $: editorTheme = $settings.editor.darkmode
    ? "dark codetheme-dark"
    : "light codetheme-light"

  $: previewTheme = $settings.preview.darkmode
    ? "dark codetheme-dark"
    : "light codetheme-light"
</script>

<div class="sheaf-container" style="width: {width}; height: {height};">
  <div class="sheaf-panes">
    <div class="sheaf-pane sheaf-pane-editor {editorTheme}">
      <Editor />
    </div>
    {#if $settings.preview.enabled && !$small}
      <div class="sheaf-pane sheaf-pane-preview {previewTheme}">
        <Player />
      </div>
    {/if}
  </div>
</div>