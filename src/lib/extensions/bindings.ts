import { keymap, ViewPlugin } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import type { SheafCore } from "$lib/core";

export interface SheafBindings {
  /** Callback fired when the user "saves", e.g. hitting `CTRL + S` */
  save?: (core: SheafCore) => void

  /**
   * Callback fired when the document state changes.
   * Bri's is debounced, but I'll add debouncing at a later time.
   */
  update?: (core: SheafCore) => void
}

export function createSheafBinding(core: SheafCore, bindings: SheafBindings) {
  const extensions: Extension[] = []

  if (bindings.save) {
    extensions.push(
      keymap.of([
        { key: "Mod-S", run: () => (bindings.save!(core), true), preventDefault: true}
      ])
    )
  }

  if (bindings.update) {
    const callback = bindings.update
    extensions.push(
      ViewPlugin.define(() => ({
        update: () => callback(core)
      }))
    )
  }

  return extensions
}