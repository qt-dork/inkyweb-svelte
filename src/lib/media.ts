/**
 * Stores and stuff cobbled together from Bri's media class[^1],
 * Eric Rovell's svelte-media-observer[^2], and cibernox's
 * svelte-media[^3]. I hope it works?
 * 
 * [^1]: https://github.com/scpwiki/wikijump/blob/develop/web/modules/components/src/lib/media.ts
 * [^2]: https://github.com/EricRovell/svelte-media-observer
 * [^3]: https://github.com/cibernox/svelte-media
 */

import { writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store"

type Media<Query extends Record<string, string> = Record<string, string>> = {
  [K in keyof Query]?: boolean | string;
} & {
  classNames: string
}

type MediaQueryLists = Record<string, MediaQueryList>

/**
 * Checks if you're doing SSR
 */
function hasMatchMedia() {
  if (typeof window !== "undefined") return Boolean(window.matchMedia)
  else return false
}

/**
 * Composes an object of current media queries state.
 */
function matchMedia(mqls: MediaQueryLists) {
  const media: Media = { classNames: "" }
  const mediaClasses = []
  for (const name in mqls) {
    media[name] = mqls[name].matches
    if (media[name]) {
      mediaClasses.push(`media-${name}`)
    }
  }
  media.classNames = mediaClasses.join(" ")
  return media;
}

/**
 * Initializes a media queries observable.
 */
export function mediaObserver<Query extends Record<string, string>>(mediaQueries: Query): Writable<Media<Query>> {
  return writable<Media<Query>>({ classNames: "" }, set => {
    if (!hasMatchMedia()) return

    const mqls: MediaQueryLists = {};
    const updateMedia = () => set(matchMedia(mqls))

    for (const key in mediaQueries) {
      const media = window.matchMedia(mediaQueries[key])
      mqls[key] = media
      mqls[key].addEventListener("change", updateMedia)
    }

    updateMedia()

    return () => {
      for (const key in mqls) {
        mqls[key].removeEventListener("change", updateMedia)
      }
    }
  })
}

const mediaQueries = {
  tiny: "(max-width: 350px)",
  narrow: "(max-width: 500px)",
  small: "(max-width: 850px)",
  normal: "(max-width: 1000px)",
  wide: "(max-width: 1400px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  light: "(prefers-color-scheme: light)",
  dark: "(prefers-color-scheme: dark)",
  canHover: "(any-hover: hover), (hover: hover)",
  landscape: "(orientation: landscape)",
  portrait: "(orientation: portrait)"
}

const media = mediaObserver(mediaQueries)

const OPERATORS = [">", "<", ">=", "<=", "=="] as const

const BREAKPOINTS = [
  ["tiny", 350],
  ["narrow", 500],
  ["small", 850],
  ["normal", 1000],
  ["wide", 1400]
] as const

export type Operator = typeof OPERATORS[number]
export type BreakpointName = typeof BREAKPOINTS[number][0]
export type BreakpointString = `${Operator | ""}${BreakpointName}`

function isBreakpoint(value: string): value is BreakpointName {
  return ["tiny", "narrow", "small", "normal", "wide"].includes(value)
}

function activeBreakpoint() {
  let current: BreakpointName = "tiny"
  
  for (const [name, bool] of Object.entries(media)) {
    if (isBreakpoint(name) && bool === true) {
      current = name
      break
    }
  }

  return current
}

function getBreakpoint(query: BreakpointName) {
  for (const [name, value] of BREAKPOINTS) {
    if (name === query) return value
  }
}

function matchBreakpoints(query: BreakpointString) {
  // figure out what operator to use
  let operator: Operator = "=="
  const match = /^[=<>]+/.exec(query)
  if (match && OPERATORS.includes(match[0] as any)) {
    operator = match[0] as Operator
  } else if (match) {
    throw new Error(`Bad operator (${match[0]}) given in breakpoint string!`)
  }

  // strip off operator to get breakpoint name
  const breakpoint = query.replace(/^[=<>]+/, "")
  if (!(breakpoint in media)) {
    throw new Error(`Bad breakpoint (${breakpoint}) given in breakpoint string!`)
  }

  const current = activeBreakpoint()
  const curIdx = getBreakpoint(current)
  const brkIdx = getBreakpoint(breakpoint as BreakpointName)

  switch (operator) {
    case "==": return curIdx === brkIdx
    case ">" : return curIdx >   brkIdx
    case "<" : return curIdx <   brkIdx
    case ">=": return curIdx >=  brkIdx
    case "<=": return curIdx <=  brkIdx
    default: throw new Error(`Query (${query}) was somehow impossible to evaluate!`)
  }
}

const matchBreakpointStore = writable(query => matchBreakpoints(query))

export const matchBreakpoint = {
  subscribe: matchBreakpointStore.subscribe
}