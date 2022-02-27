import { writable } from "svelte/store";

type Media<Query extends Record<string, string> = Record<string, string>> = {
  [K in keyof Query]?: boolean | string;
} & {
  classNames: string
}

type MediaQueryLists = Record<string, MediaQueryList>

function calculateMedia(mqls: MediaQueryLists) {
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

function hasMatchMedia() {
  if (typeof window !== "undefined") return Boolean(window.matchMedia)
  else return false
}

export function watchMedia<Query extends Record<string, string>>(mediaqueries: Query) {
  return writable<Media<Query>>({ classNames: "" }, set => {
    if (!hasMatchMedia()) return
    const mqls: MediaQueryLists = {};
    const updateMedia = () => set(calculateMedia(mqls))
    for (const key in mediaqueries) {
      const foo = window.matchMedia(mediaqueries[key])
      mqls[key] = foo
      mqls[key].addEventListener("change", () => updateMedia)
    }
    updateMedia()
    return () => {
      for (const key in mqls) {
        mqls[key].removeListener(updateMedia)
      }
    }
  })
}