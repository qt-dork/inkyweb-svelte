// Also based off of @Monkatraz's Sheaf Editor
// Source code here:
// https://github.com/scpwiki/wikijump/blob/e4a0851d2db72bd004ea06fab892d1b05cdd3369/web/modules/sheaf/src/state.ts

import type { EditorState, Text } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { Gutters } from "./gutters";
// also imports { syntaxTree } from '@codemirror/language'
// but I'm not gonna use that right now.
// also also imports { getActiveLines, Gutters, textBuffer, textValue } from wikijump's own codemirror stuff linked here:
// https://github.com/scpwiki/wikijump/tree/e4a0851d2db72bd004ea06fab892d1b05cdd3369/web/modules/codemirror/src
// I'm not gonna bother with that either for now.

import type { SheafCore } from "./core";
import type { SheafBindings } from "./extensions/bindings";


export interface SheafStateConstructorOpts {
  self: SheafCore
  view: EditorView
  bindings: SheafBindings
  // bindings are just for saving things, so don't bother right now
}

// From: https://github.com/scpwiki/wikijump/blob/develop/web/modules/codemirror/src/misc.ts
/** Asynchronously compiles a `Text` object into a single string */
async function textValue(doc: Text) {
  let out = ''
  // let last = 0

  for (const str of doc) {
    out += str
    // // throttle on 32k chunks
    // if (out.length - last > 32768) {
    //   last = out.length
    //   // I think this is debouncing or something idk
    //   // Bri let me know that it's actually throttling
    //   await animationFrame()
    // }
  }

  return out
}

const encoder = new TextEncoder()

/** Asynchronously compiles a `Text` object into a `Uint8Array buffer. */
async function textBuffer(doc: Text) {
  let len = 0
  // let last = 0
  const buffers: Uint8Array[] = []
  
  for (const str of doc) {
    const buffer = encoder.encode(str)
    buffers.push(buffer)
    len += buffer.length

    // //throttles on 32k chunks
    // if (len - last > 32768) {
    //   last = len
    //   await animationFrame()
    // }
  }

  let pos = 0
  const out = new Uint8Array(len)
  // uses idleCallback, which also does debouncing, but i'm not going to use it
  // Bri also informed me that this is for throttling.
  // i'm sorry for mixing up debouncing and throttling.
  for (const buffer of buffers) {
    out.set(buffer, pos)
    pos += buffer.length
  }

  return out
}

/**
 * Gets the "active lines" of a state. This includes any
 * lines the user has a cursor on and all lines touching
 * their selection box, if any.
 */
function getActiveLines(state: EditorState) {
  const activeLines: Set<number> = new Set()
  for (const range of state.selection.ranges) {
    const lnStart = state.doc.lineAt(range.from).number
    const lnEnd = state.doc.lineAt(range.to).number
    if (lnStart === lnEnd) activeLines.add(lnStart - 1)
    else {
      const diff = lnEnd - lnStart
      for (let lineNo = 0; lineNo <= diff; lineNo++) {
        activeLines.add(lnStart + lineNo - 1)
      }
    }
  }
  return activeLines
}

export class SheafState {
  declare readonly self: SheafCore
  declare readonly parent: Element
  declare readonly view: EditorView
  // declares bindings for saving
  declare readonly bindings: SheafBindings
  declare readonly state: EditorState
  declare readonly doc: Text
  // declares activeLines for gutters maybe?
  declare readonly activeLines: Set<number>

  constructor(opts: SheafStateConstructorOpts) {
    this.self = opts.self
    this.view = opts.view
    this.bindings = opts.bindings
    this.state = opts.view.state
    this.doc = opts.view.state.doc
    // also constructs active lines
    this.activeLines = getActiveLines(opts.view.state)
  }

  private declare _value?: string

  // this just seems like a getter function for the value.
  async value() {
    if (this._value) return this._value
    return (this._value) = await textValue(this.doc)
  }

  async buffer() {
    return await textBuffer(this.doc)
  }

  // get tree() {
  //   return syntaxTree(this.state)
  // }

  get gutters() {
    return Gutters.get(this.state)
  }

  set gutters(state: boolean) {
    Gutters.set(this.view, state)
  }

  extend(opts?: Partial<SheafStateConstructorOpts>) {
    return new SheafState({
      self: this.self,
      view: this.view,
      bindings: this.bindings,
      ...opts
    })
  }
}