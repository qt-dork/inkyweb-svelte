<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  
  import { EditorState } from '@codemirror/state';
  import { EditorView, keymap } from '@codemirror/view'
  import { defaultKeymap } from '@codemirror/commands'

  const dispatch = createEventDispatcher();

  export let startText = '';

  let editor: HTMLElement
  let editorState: EditorState;
  let view: EditorView
  let editorFunctions;

  let currentCursor;

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function createEditorState(text) {
    // Clear out the div element in case a previous editor was created.
    editor.innerHTML = ''

    // Setup the extensions array.
    const exts = [
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          fire('textChange', {
            value: getValue(),
            cursor: getCursor(),
            history: {}
          })
        }
      })
    ]

    // Create the editor state.
    editorState = EditorState.create({
      doc: text,
      extensions: exts
    })

    view = new EditorView({
      state: editorState,
      parent: editor
    })
  }
  
  onMount(async () => {
    createEditorState(startText)

    editorFunctions = {
      getValue: getValue,
      getCursor: getCursor
    }

    // Give the parent the functions for interacting with the editor.
    fire('editorChange', editorFunctions)

    // Make sure the editor is focused.
    focus()
  })

  onDestroy(() => {
    if (view) view.destroy()
  })

  function getCursor() {
    if (typeof view !== 'undefined') {
      currentCursor = view.state.selection.main.head
      return(currentCursor)
    } else {
      return(0)
    }
  }

  function getValue() {
    if (typeof view !== 'undefined') {
      return view.state.doc.toString()
    }
  }
</script>

<div class="code-display-container">
  <div class="code-display" bind:this={editor} />
</div>