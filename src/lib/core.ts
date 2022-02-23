// This is all super heavily based off of @Monkatraz's wonderful Sheaf editor.
// Please give them some love or something

import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { writable, type Writable } from 'svelte/store'
import { SheafState } from "./state"

export class SheafCore {
  declare state: SheafState
  private declare store: Writable<SheafState>
  declare subscribe: Writable<SheafState>["subscribe"]
  declare set: Writable<SheafState>["set"]

  constructor(doc: string, extensions: Extension[] = []) {
    const updateHandler = ViewPlugin.define(() => ({
      update: viewUpdate => this.update(viewUpdate)
    }))

    const view = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [
          EditorView.lineWrapping,
          extensions,
          updateHandler
        ]
      })
    })

    this.state = new SheafState({ self: this, view})
    this.store = writable(this.state)
    this.subscribe = this.store.subscribe
    this.set = this.store.set
  }

  private update(update: ViewUpdate) {
    if (!update.docChanged && !update.selectionSet) return
    this.state = this.state.extend()
    this.store.set(this.state)
  }

  mount(element: Element) {
    element.appendChild(this.state.view.dom)
  }

  /**
   * Destroys the editor.
   */
  destroy() {
    this.state.view.destroy()
  }
}